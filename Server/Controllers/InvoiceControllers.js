const { connectDB, sql } = require("../Utils/Connection")
const { generateDeliverySchedule } = require("../Services/OrderSchedule")

const cron = require('node-cron')
const moment = require('moment-timezone')
const PDFDocument = require('pdfkit')
const fs = require("fs");

async function handleGenerateInvoice() {
    await handleInvoiceManagement()
    console.log("invoice generated")
}

async function handleInvoiceManagement() {
    try {
        const pool = await connectDB()
        let selectSKU_Pricingdaywise = await pool.request()
            .query('SELECT * FROM SKU_Pricingdaywise')

        selectSKU_Pricingdaywise = selectSKU_Pricingdaywise.recordsets[0]
        // console.log(selectSKU_Pricingdaywise)

        const currentISTDate = moment.tz('Asia/Kolkata');
        // console.log(currentISTDate);
        let previousDay = currentISTDate.clone().subtract(1, 'day');
        let formattedDate = previousDay.format('YYYY-MM-DD');
        // console.log(formattedDate);

        let selectCust_ID = await pool.request()
            .input('formattedDate', sql.Date, formattedDate)
            .query('SELECT * FROM Order_Data WHERE OrderDate = @formattedDate AND (OrderDeleted = 0 OR OrderDeleted IS NULL)')

        let orderData = selectCust_ID.recordset
        // console.log(orderData);

        for (const element of orderData) {
            let Cust_ID = element.Cust_ID;
            // console.log(Cust_ID);

            let fetchCat_ID = await pool.request()
                .input('Cust_ID', sql.Int, Cust_ID)
                .query('SELECT ISNULL(Cat_ID, 1) AS Cat_ID FROM CustMaster WHERE Cust_ID = @Cust_ID');

            let Cat_ID = fetchCat_ID.recordsets[0][0].Cat_ID
            console.log(Cat_ID + "  cat");

            let setCat_ID = await pool.request()
                .input('Cust_ID', sql.Int, Cust_ID)
                .input('Cat_ID', sql.Int, Cat_ID)
                .query('UPDATE Order_Data SET CustCat_ID = @Cat_ID WHERE Cust_ID = @Cust_ID');

            // fetchCat_ID = await pool.request()
            //     .input('Cust_ID', sql.Int, Cust_ID)
            //     .query('SELECT CustCat_ID FROM Order_Data WHERE Cust_ID = @Cust_ID');
            // console.log(fetchCat_ID.recordset)

            let getMul_Fact = await pool.request()
                .input('Cat_ID', sql.Int, Cat_ID)
                .query('SELECT Mul_Fact FROM Category_ID WHERE Cat_ID = @Cat_ID');

            let Mul_Fact = getMul_Fact.recordset[0].Mul_Fact
            // console.log(Mul_Fact)

            // let RateList = 
            // let getPurchase_Amount = 
            for (const element of selectSKU_Pricingdaywise) {
                let SKUID = element.SKUID
                let Purchase_Amount = element.Purchase_Amount * Mul_Fact

                let setRate = await pool.request()
                    .input('Cust_ID', sql.Int, Cust_ID)
                    .input('SKUID', sql.Int, SKUID)
                    .input('formattedDate', sql.Date, formattedDate)
                    .input('Purchase_Amount', sql.Float, Purchase_Amount)
                    .query('UPDATE Order_Data SET Rate = @Purchase_Amount WHERE Cust_ID = @Cust_ID AND SKUID = @SKUID AND OrderDate = @formattedDate AND Order_sts = 1');

                let setAmount = await pool.request()
                    .input('Cust_ID', sql.Int, Cust_ID)
                    .input('SKUID', sql.Int, SKUID)
                    .input('formattedDate', sql.Date, formattedDate)
                    .input('Purchase_Amount', sql.Float, Purchase_Amount)
                    .query('UPDATE Order_Data SET Amount = Rate * Qty WHERE Cust_ID = @Cust_ID AND SKUID = @SKUID AND OrderDate = @formattedDate AND Order_sts = 1');
            }
        }
        return selectSKU_Pricingdaywise;
    } catch (err) {
        console.log(err)
    }
}

async function handleSetCustInvoice(req, res) {
    let Cust_ID = req.user.id
    // console.log(Cust_ID)
    await handleInvoiceManagement()
    const currentISTDate = moment.tz('Asia/Kolkata');
    // console.log(currentISTDate);
    let previousDay = currentISTDate.clone().subtract(1, 'day');
    const formattedDate = previousDay.format('YYYY-MM-DD');
    // console.log(result)
    // console.log(formattedDate);

    try {
        const pool = await connectDB()
        let getTotalAmount = await pool.request()
            .input('Cust_ID', sql.Int, Cust_ID)
            .input('formattedDate', sql.Date, formattedDate)
            .query('SELECT SUM(Amount) AS Total_Amount, DeliverySlot, OrderDate FROM Order_Data WHERE Cust_ID = @Cust_ID AND OrderDate = @formattedDate AND Order_sts = 1 GROUP BY DeliverySlot, OrderDate')

        if (getTotalAmount.recordset.length === 0) {
            return res.send({ error: "No orders found for the specified date." });
        }

        let Total_Amount = getTotalAmount.recordset[0].Total_Amount
        let DeliverySlot = getTotalAmount.recordset[0].DeliverySlot
        let OrderDate = getTotalAmount.recordset[0].OrderDate

        const newdate = new Date(OrderDate);

        // Extract the date parts
        const year = newdate.getFullYear();
        const month = String(newdate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(newdate.getDate()).padStart(2, '0');

        OrderDate = `${year}-${month}-${day}`;
        // console.log(OrderDate); // Output: "2024-10-04"
        // console.log(Total_Amount)
        // console.log(DeliverySlot)
        // console.log(OrderDate)

        let getSchedule = generateDeliverySchedule().deliveryTimes
        // console.log(getSchedule)

        const DeliverySchedule = getSchedule.find(obj => obj.id === DeliverySlot);
        // console.log(DeliverySchedule)

        let startTime = DeliverySchedule.startTime
        let endTime = DeliverySchedule.endTime
        // console.log(startTime)
        // console.log(endTime)
        let custInvoicedOrder = await pool.request()
            .input('Cust_ID', sql.Int, Cust_ID)
            .input('formattedDate', sql.Date, formattedDate)
            .query('SELECT * FROM Order_Data WHERE Cust_ID = @Cust_ID AND OrderDate = @formattedDate AND Order_sts = 1')

        // let setOrder_sts = await pool.request()
        //     .input('Cust_ID', sql.Int, Cust_ID)
        //     .input('formattedDate', sql.Date, formattedDate)
        //     .query('UPDATE Order_Data SET Order_sts = 2 WHERE Cust_ID = @Cust_ID AND OrderDate = @formattedDate AND Order_sts = 1');

        const currentDateTime = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');

        let CustCat_ID = custInvoicedOrder.recordset[0].CustCat_ID
        custInvoicedOrder = custInvoicedOrder.recordset
        console.log(custInvoicedOrder)
        console.log(CustCat_ID)

        let setInvoiceNumber = await pool.request()
            .input('currentDateTime', sql.DateTimeOffset, currentDateTime)
            .input('Cust_ID', sql.Int, Cust_ID)
            .input('CustCat_ID', sql.Int, CustCat_ID)
            .input('Total_Amount', sql.Float, Total_Amount)
            .query(`INSERT INTO Invoice_data (InvDtime, InvNo, CustID, CustCat_ID, Amount) VALUES (@currentDateTime, (SELECT ISNULL(MAX(InvNo), 0) + 1 FROM Invoice_data), @Cust_ID, @CustCat_ID, @Total_Amount)`)

        res.send({ OrderDate, startTime, endTime, custInvoicedOrder, Total_Amount })
    } catch (err) {
        console.log(err)
    }
}

async function handleGenerateInvoicePDF(req, res) {
    // Fetch customer ID
    let Cust_ID = req.user.id;

    // Fetch current date
    const currentISTDate = moment.tz('Asia/Kolkata');
    let previousDay = currentISTDate.clone().subtract(1, 'day');
    const formattedDate = previousDay.format('YYYY-MM-DD');

    // Create a PDF document
    const doc = new PDFDocument();

    // Set response headers for PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=invoice.pdf');

    // Pipe the document to the response
    doc.pipe(res);

    // Title
    doc.fontSize(18).text('Invoice', { align: 'center' });
    doc.moveDown();

    // Fetch invoice details from the database
    const pool = await connectDB();
    try {
        const getInvoice = await pool.request()
            .input('Cust_ID', sql.Int, Cust_ID)
            .query('SELECT TOP 1 InvNo, InvDtime, Amount FROM Invoice_data WHERE CustID = @Cust_ID ORDER BY InvNo DESC;');

        const invoiceNumber = getInvoice.recordset[0].InvNo;
        const date = getInvoice.recordset[0].InvDtime;
        const Amount = getInvoice.recordset[0].Amount;
        const deliveryCharge = 0;

        // Fetch customer details
        const getCustName = await pool.request()
            .input('Cust_ID', sql.Int, Cust_ID)
            .query('SELECT Name_of_Cust FROM CustMaster WHERE Cust_ID = @Cust_ID');
        const customerName = getCustName.recordset[0].Name_of_Cust;

        // Invoice details in PDF
        doc.fontSize(12).text(`Invoice Number: ${invoiceNumber}`, { align: 'left' });
        doc.text(`Customer Name: ${customerName}`, { align: 'left' });
        doc.text(`Date: ${date}`, { align: 'left' });
        doc.moveDown();
        doc.moveDown().lineTo(550, doc.y).stroke();
        doc.moveDown(); // Move down to add spacing

        // Fetch customer order items
        const custInvoicedOrder = await pool.request()
            .input('Cust_ID', sql.Int, Cust_ID)
            .input('formattedDate', sql.Date, formattedDate)
            .query('SELECT * FROM Order_Data WHERE Cust_ID = @Cust_ID AND OrderDate = @formattedDate AND Order_sts = 1');
        const items = custInvoicedOrder.recordset;

        // Draw table for invoice items
        const tableHeaders = ['S.No', 'Item Name', 'Qty', 'Rate', 'Amount'];
        drawTable(doc, tableHeaders, items);

        // Final summary
        doc.moveDown().lineTo(550, doc.y).stroke(); // Draw a line before totals
        doc.moveDown(); // Move down to add spacing

        // Set font size for totals
        doc.fontSize(12);

        // Total Amounts
        doc.text(`Total Amount: ${Amount.toFixed(2)}`, { align: 'left', width: 400 });
        doc.moveDown();
        doc.text(`Delivery Charge: ${deliveryCharge.toFixed(2)}`, { align: 'left', width: 400 });
        doc.moveDown();
        doc.text(`Net Payable: ${(Amount + deliveryCharge).toFixed(2)}`, { align: 'left', width: 400 });
        doc.moveDown();

        // Draw a line after the totals for separation
        doc.moveDown().lineTo(550, doc.y).stroke(); // Draw another line

    } catch (error) {
        console.error('Error fetching invoice details:', error);
        res.status(500).send('Internal Server Error');
        return; // Exit the function early if there's an error
    }

    // End the document
    doc.end();
}

function drawTable(doc, headers, items) {
    const columnWidth = [50, 200, 100, 100, 100]; // Column widths
    const startX = 50;
    let currentY = doc.y;

    // Draw headers
    headers.forEach((header, i) => {
        doc.fontSize(12).font('Helvetica-Bold').text(header, startX + columnWidth.slice(0, i).reduce((a, b) => a + b, 0), currentY, {
            width: columnWidth[i],
            align: 'center'
        });
    });

    // Move below header
    currentY += 20;
    doc.moveTo(startX, currentY).lineTo(startX + columnWidth.reduce((a, b) => a + b, 0), currentY).stroke();
    currentY += 10;

    // Draw table rows
    items.forEach((item, index) => {
        doc.fontSize(10).font('Helvetica');

        doc.text(index + 1, startX, currentY, { width: columnWidth[0], align: 'center' });
        doc.text(item.SKUName, startX + columnWidth[0], currentY, { width: columnWidth[1], align: 'center' });
        doc.text(item.Qty, startX + columnWidth[0] + columnWidth[1], currentY, { width: columnWidth[2], align: 'center' });
        doc.text(item.Rate.toFixed(2), startX + columnWidth[0] + columnWidth[1] + columnWidth[2], currentY, { width: columnWidth[3], align: 'center' });
        doc.text(item.Amount.toFixed(2), startX + columnWidth[0] + columnWidth[1] + columnWidth[2] + columnWidth[3], currentY, { width: columnWidth[4], align: 'center' });

        currentY += 20; // Move to next row
    });

    // Line below last row
    currentY += 10;
    doc.moveTo(startX, currentY).lineTo(startX + columnWidth.reduce((a, b) => a + b, 0), currentY).stroke();
}

function scheduleInvoice() {
    cron.schedule('13 17 * * *', () => {
        handleGenerateInvoice()
    }, {
        scheduled: true,
        timezone: "Asia/Kolkata"
    })
}

module.exports = {
    scheduleInvoice,
    handleInvoiceManagement,
    handleSetCustInvoice,
    handleGenerateInvoicePDF,
}
