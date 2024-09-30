const { connectDB, sql } = require("../Utils/Connection");
const { generateDeliveryDate, generateDeliverySchedule } = require("../Services/OrderSchedule")

async function handleDeliverySchedule(req, res) {
    try {
        const deliverySchedule = generateDeliverySchedule()

        console.log(deliverySchedule)

        res.status(200).send(deliverySchedule)
    } catch (err) {
        console.log(err)
    }
}

async function handleSubmitOrder(req, res) {
    let Cust_ID = req.user.id
    // console.log(Cust_ID)
    // console.log(req.user)
    let { count, selectedSchedule } = req.body;
    try {
        const pool = await connectDB()
        const result = await pool.request().query(`SELECT MAX(OrderID) AS Last_Order FROM Order_Data WHERE Cust_ID = ${Cust_ID}`)

        let Last_Order = result.recordset[0].Last_Order || 0
        console.log(Last_Order)

        let OrderID = Last_Order += 1

        let currentDateTime = new Date();
        let currentDateTimeIST = new Date(currentDateTime.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
        let OrderDtime = new Date(currentDateTimeIST.getTime() - (currentDateTimeIST.getTimezoneOffset() * 60000)).toISOString().split('.')[0];
        // console.log(OrderID)
        console.log(OrderDtime)

        let OrderDate = currentDateTime.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
        // console.log(OrderDate)
        // console.log(Cust_ID)
        // console.log(count)


        let DeliverySlot = selectedSchedule
        for (const item of count) {
            let { SKUID } = item;
            await pool.request()
                .input('OrderID', sql.Int, OrderID)
                .input('OrderDtime', sql.DateTime, OrderDtime)  
                .input('OrderDate', sql.Date, OrderDate)        
                .input('DeliverySlot', sql.Int, DeliverySlot)  
                .input('Order_sts', sql.Int, 1)  
                .input('Cust_ID', sql.Int, Cust_ID)
                .input('SKUID', sql.Int, SKUID)
                .query(`UPDATE Order_Data SET OrderID = @OrderID, OrderDtime = @OrderDtime, OrderDate = @OrderDate, DeliverySlot = @DeliverySlot, Order_sts = @Order_sts WHERE Cust_ID = @Cust_ID AND SKUID = @SKUID`)

        }
        // for(const item of count) {
        //     let { SKUID, Qty } = item;
        //     await pool.request()
        //     .input('OrderID', sql.Int, OrderID)
        //     .input('OrderDtime', sql.DateTime, OrderDtime)
        //     .input('OrderDate', sql.Date, OrderDate)
        //     .input('Cust_ID', sql.Int, Cust_ID)
        //     .input('SKUID', sql.Int, SKUID)
        //     .input('Qty', sql.Int, Qty)
        //     .input('DeliverySlot', sql.Int, DeliverySlot)
        //     .query(`INSERT INTO Order_Data (OrderID, OrderDtime, OrderDate, Cust_ID, SKUID, Qty, DeliverySlot) VALUES (@OrderID, @OrderDtime, @OrderDate, @Cust_ID, @SKUID, @Qty, @DeliverySlot)`)

        // }
        setDeliverySlot(Cust_ID, OrderID, DeliverySlot)
    } catch (err) {
        console.log(err)
    }
}

async function setDeliverySlot(Cust_ID, Order_ID, Delivery_Slot) {
    let Delivery_Date = generateDeliveryDate()
    let [day, month, year] = Delivery_Date.split("-");

    Delivery_Date = `${year}-${month}-${day}`
    // console.log(Delivery_Date, Cust_ID, Order_ID, Delivery_Slot)

    const pool = await connectDB()

    await pool.request()
        .input('Cust_ID', sql.Int, Cust_ID)
        .input('Order_ID', sql.Int, Order_ID)
        .input('Delivery_Date', sql.Date, Delivery_Date)
        .input('Delivery_Slot', sql.Int, Delivery_Slot)
        .query(`INSERT INTO Delivery_slot (Cust_ID, Order_ID, Delivery_Date, Delivery_Slot) VALUES (@Cust_ID, @Order_ID, @Delivery_Date, @Delivery_Slot)`)
}

module.exports = {
    handleDeliverySchedule,
    handleSubmitOrder,
}
