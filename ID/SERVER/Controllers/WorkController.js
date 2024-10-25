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
        if(result.recordset[0]) {
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

            return res.status(200).send({success: `Task assigned to Employee ID ${empName}`})
        } else {
            return res.send({error: `Employee not exist of ID ${empID}`})
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

module.exports = {
    handleWorkAssigning,
    handleGetAllWork,
}
