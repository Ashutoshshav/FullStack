const { connectDB, sql } = require("../Utils/Connection");
const moment = require("moment-timezone");

async function handleWorkAssigning(req, res) {
    let EmployeeID = req.employee.id
    console.log(req.employee);
    let { empID, workName, empWork, workCat, deadline, remark } = req.body

    const currentDateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    // console.log(empID, empWork, workName, workCat, deadline, currentDateTime, remark)
    try {
        const pool = await connectDB()

        const result = await pool.request()
            .input('empID', sql.Int, empID)
            .query("SELECT * FROM EmployeeMaster WHERE EmployeeID = @empID")

        const result2 = await pool.request()
            .input('EmployeeID', sql.Int, EmployeeID)
            .query("SELECT * FROM EmployeeMaster WHERE EmployeeID = @EmployeeID")

        let AssignedBy = result2.recordset[0].EmployeeName
        if (result.recordset[0]) {
            let empName = result.recordset[0].EmployeeName
            // console.log(empName);
            // console.log(AssignedBy);
            const result2 = await pool.request()
                .input('empID', sql.Int, empID)
                .input('empWork', sql.VarChar, empWork)
                .input('empName', sql.VarChar, empName)
                .input('workName', sql.VarChar, workName)
                .input('AssignedBy', sql.VarChar, AssignedBy)
                .input('currentDateTime', sql.DateTimeOffset, currentDateTime)
                .input('deadline', sql.DateTimeOffset, deadline)
                .input('workCat', sql.Int, workCat)
                .input('remark', sql.VarChar, remark)
                .query(`INSERT INTO WorkMaster (EmployeeID, EmployeeWork, EmployeeName, AssignedDTime, Deadline, WorkCategory, WorkRemarks, WorkName, AssignedBy) VALUES (@empID, @empWork, @empName, @currentDateTime, @deadline, @workCat, @remark, @workName, @AssignedBy)`)

            return res.status(200).send({ success: `Task assigned to Employee ID ${empName}` })
        } else {
            return res.send({ error: `Employee not exist of ID ${empID}` })
        }

    } catch (err) {
        console.log(err)
    }
}

async function handleGetAllWork(req, res) {
    try {
        const pool = await connectDB()

        const result = await pool.request()
            .query("SELECT * FROM WorkMaster")

        console.log(result)
        res.status(200).send(result.recordset)
    } catch (err) {
        console.log(err)
    }
}

async function handleGetSiteImage(req, res) {
    const employeeId = req.employee.id;

    try {
        let pool = await connectDB();
        const result = await pool.request()
            .input('EmployeeID', sql.Int, employeeId)
            .query('SELECT * FROM SiteVisitHistory');

        if (result.recordset.length > 0) {
            // Use Promise.all to handle asynchronous mapping
            const images = await Promise.all(
                result.recordset.map(async (record) => {
                    const imageBuffer = record.SiteImage;
                    const employeeID = record.EmployeeID;

                    // Await the nested query for each record
                    const employeeResult = await pool.request()
                        .input("employeeID", sql.Int, employeeID)
                        .query(`SELECT * FROM EmployeeMaster WHERE EmployeeID = @employeeID`);

                    // console.log(employeeResult.recordset[0].EmployeeName);

                    return {
                        id: record.EntryNo,
                        employeeID: record.EmployeeID,
                        employeeName: employeeResult.recordset[0].EmployeeName,
                        entryDTime: record.EntryDTime,
                        siteLocation: record.SiteLocation,
                        image: `data:image/jpeg;base64,${imageBuffer.toString('base64')}`
                    };
                })
            );

            res.json(images);
        } else {
            res.status(404).json({ message: 'No images found for this employee.' });
        }
    } catch (err) {
        console.error('Error retrieving image:', err);
        res.status(500).json({ message: 'Error retrieving image' });
    }
}

async function handleGetDailyEmployeeEntry(req, res) {
    try {
        const pool = await connectDB()

        let result = await pool.request()
            .query(`SELECT * 
                        FROM DailyEmployeeEntry 
                        WHERE CAST(Date AS DATE) = CAST(GETDATE() AS DATE)`)

        console.log(result.recordset);

        return res.send(result.recordset)
    } catch (err) {
        console.log(err)
    }
}

async function handleUpdateEmployeeEntry(req, res) {
    const updates = req.body;

    try {
        for (const [entryNo, values] of Object.entries(updates)) {
            const { timeIn, timeOut, jobCategory } = values;

            console.log(jobCategory)
            const pool = await connectDB()

            await pool.request()
                .input("entryNo", sql.Int, entryNo)
                .input("timeIn", sql.DateTimeOffset, timeIn)
                .input("timeOut", sql.DateTimeOffset, timeOut)
                .input("jobCategory", sql.VarChar, jobCategory)
                .query(`
                    UPDATE DailyEmployeeEntry
                    SET 
                        TimeIn = COALESCE(@timeIn, TimeIn),  -- Use existing value if new value is null
                        TimeOut = COALESCE(@timeOut, TimeOut),
                        JobCategory = COALESCE(@jobCategory, JobCategory)
                    WHERE EntryNo = @entryNo
            `, {
                    entryNo: entryNo,
                    timeIn: timeIn || null,
                    timeOut: timeOut || null,
                    jobCategory: jobCategory || null,
            });
        }

        res.status(200).send('Entries updated successfully');
    } catch (error) {
        console.error('Error updating entry:', error);
        res.status(500).send('Error updating entry');
    }
}

module.exports = {
    handleWorkAssigning,
    handleGetAllWork,
    handleGetSiteImage,
    handleGetDailyEmployeeEntry,
    handleUpdateEmployeeEntry,
}
