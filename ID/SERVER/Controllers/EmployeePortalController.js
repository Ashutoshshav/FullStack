const { connectDB, sql } = require("../Utils/Connection");
const moment = require("moment-timezone");

async function handleGetWork(req, res) {
    let EmployeeID = req.employee.id
    console.log(req.employee);
    
    try {
        const pool = await connectDB()
        let result = await pool.request()
            .input('EmployeeID', sql.Int, EmployeeID)
            .query("SELECT * FROM WorkMaster WHERE EmployeeID = @EmployeeID")

        // console.log(result.recordset.length)
        if(result.recordset.length > 0) {
            console.log(result.recordset)
            return res.status(200).send(result.recordset)
        } else {
            return res.send({error: `${req.employee.name}, no Task`})
        }
    } catch (err) {
        console.log(err);
    }
}

async function handleWorkInfo(req, res) {
    let { workID } = req.body;

    try {
        const pool = await connectDB()

        let result = await pool.request()
            .input('workID', sql.Int, workID)
            .query("SELECT * FROM WorkMaster WHERE WorkID = @workID")

        console.log(result.recordset);
        res.status(200).send(result.recordset)
    } catch (err) {
        console.log(err);
    }
}

async function handleWorkAssignMe(req, res) {
    let empID = req.employee.id
    console.log(req.employee);
    let { empWork, workName, workCat, deadline, remark } = req.body

    const currentDateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    console.log(empID, empWork, workCat, deadline, currentDateTime, remark)
    try {
        const pool = await connectDB()

        const result = await pool.request()
                .input('empID', sql.Int, empID)
                .query("SELECT * FROM EmployeeMaster WHERE EmployeeID = @empID")
                
        if(result.recordset[0]) {
            let empName = result.recordset[0].EmployeeName
            console.log(empName);
            const result2 = await pool.request()
                    .input('empID', sql.Int, empID)
                    .input('empWork', sql.VarChar, empWork)
                    .input('workName', sql.VarChar, workName)
                    .input('empName', sql.VarChar, empName)
                    .input('currentDateTime', sql.DateTimeOffset, currentDateTime)
                    .input('deadline', sql.DateTimeOffset, deadline)
                    .input('workCat', sql.Int, workCat)
                    .input('remark', sql.VarChar, remark)
                    .query(`INSERT INTO WorkMaster (EmployeeID, EmployeeWork, EmployeeName, AssignedDTime, Deadline, WorkCategory, WorkRemarks, AssignedBy, WorkName) VALUES (@empID, @empWork, @empName, @currentDateTime, @deadline, @workCat, @remark, @empID, @workName)`)

            return res.status(200).send({success: `Task assigned to Employee ID ${empName}`})
        } else {
            return res.send({error: `Employee not exist of ID ${empID}`})
        }
        
    } catch (err) {
        console.log(err)
    }
}

async function handleEmployeeTimeIn(req, res) {
    let empID = req.employee.id;
    let EmployeeName;
    const currentDateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    const currentDate = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");

    try {
        const pool = await connectDB();

        if (empID) {
            // Get employee's details
            const result = await pool.request()
                .input('empID', sql.Int, empID)
                .query("SELECT * FROM EmployeeMaster WHERE EmployeeID = @empID");

            EmployeeName = result.recordset[0].EmployeeName;

            if (result.recordset[0]) {
                console.log(EmployeeName);

                // Check if a TimeIn entry already exists for the current date
                const timeInCheck = await pool.request()
                    .input('empID', sql.Int, empID)
                    .input('currentDate', sql.Date, currentDate)  // Pass only the date part
                    .query("SELECT * FROM DailyEmployeeEntry WHERE EmployeeID = @empID AND CAST(TimeIn AS DATE) = @currentDate");

                if (timeInCheck.recordset.length > 0) {
                    // If entry exists, return a message saying the employee has already clocked in
                    return res.send({ error: "You have already clocked in today." });
                }

                // If no entry exists, insert the new TimeIn entry
                const result2 = await pool.request()
                    .input('empID', sql.Int, empID)
                    .input('EmployeeName', sql.VarChar, EmployeeName)
                    .input('currentDateTime', sql.DateTimeOffset, currentDateTime)
                    .query("INSERT INTO DailyEmployeeEntry (EmployeeID, EmployeeName, TimeIn, LoggedStatus) VALUES (@empID, @EmployeeName, @currentDateTime, 1)");

                return res.status(200).send({ success: "Time In Recorded Successfully" });
            } else {
                return res.send({ error: empID + " Employee does not exist" });
            }
        } else {
            return res.send({ error: "ACCESS DENIED" });
        }
    } catch (err) {
        console.log(err);
        return res.send({ error: "Server error occurred" });
    }
}

async function handleEmployeeTimeOut(req, res) {
    let empID = req.employee.id;
    let EmployeeName;
    const currentDateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    const currentDate = moment().tz("Asia/Kolkata").format("YYYY-MM-DD"); 

    try {
        const pool = await connectDB();

        if (empID) {
            // Get employee's details
            const result = await pool.request()
                .input('empID', sql.Int, empID)
                .query("SELECT * FROM EmployeeMaster WHERE EmployeeID = @empID");

            EmployeeName = result.recordset[0].EmployeeName;

            if (result.recordset[0]) {
                console.log(EmployeeName);

                // Check if a TimeIn entry already exists for the current date
                const timeInCheck = await pool.request()
                    .input('empID', sql.Int, empID)
                    .input('currentDate', sql.Date, currentDate)  // Pass only the date part
                    .query("SELECT * FROM DailyEmployeeEntry WHERE EmployeeID = @empID AND CAST(TimeIn AS DATE) = @currentDate");

                if (timeInCheck.recordset.length > 0) {
                    const timeOutCheck = await pool.request()
                        .input('empID', sql.Int, empID)
                        .input('currentDate', sql.Date, currentDate)  // Pass only the date part
                        .query("SELECT * FROM DailyEmployeeEntry WHERE EmployeeID = @empID AND CAST(TimeOut AS DATE) = @currentDate");

                    if(timeOutCheck.recordset.length > 0) {
                        return res.send({ error: "You have already clocked out today." });
                    }

                    const result2 = await pool.request()
                        .input('empID', sql.Int, empID)
                        .input('currentDateTime', sql.DateTimeOffset, currentDateTime)
                        .input('currentDate', sql.Date, currentDate)
                        .query("UPDATE DailyEmployeeEntry SET TimeOut = @currentDateTime, LoggedStatus = 2 WHERE EmployeeID = @empID AND CAST(TimeIn AS DATE) = @currentDate");
                    
                    return res.send({ success: "You have successfully clocked out today." });
                } else {
                    return res.send({ error: "You have not clocked in today." });
                }
            } else {
                return res.send({ error: empID + " Employee does not exist" });
            }
        } else {
            return res.send({ error: "ACCESS DENIED" });
        }
    } catch (err) {
        console.log(err);
        return res.send({ error: "Server error occurred" });
    }
}

async function handleEmployeeLoggedStatus(req, res) {
    let empID = req.employee.id;
    let EmployeeName;
    const currentDateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    const currentDate = moment().tz("Asia/Kolkata").format("YYYY-MM-DD"); 

    try {
        if(empID) {
            const pool = await connectDB();

            const result = await pool.request()
                        .input('empID', sql.Int, empID)
                        .input('currentDate', sql.Date, currentDate)  // Pass only the date part
                        .query("SELECT * FROM DailyEmployeeEntry WHERE EmployeeID = @empID AND CAST(TimeIn AS DATE) = @currentDate");

            const logStatus = result.recordset.length > 0 ? result.recordset[0].LoggedStatus : 0;
            console.log(`LogStatus: ${logStatus}`);

            return res.send({ logStatus });
        } else {
            return res.send({error: "ACCESS DENIED"})
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    handleGetWork,
    handleWorkInfo,
    handleWorkAssignMe,
    handleEmployeeTimeIn,
    handleEmployeeTimeOut,
    handleEmployeeLoggedStatus,
}
