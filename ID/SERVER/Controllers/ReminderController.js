const { connectDB, sql } = require("../Utils/Connection");
const { handleSendEmail } = require("../Services/SendNotification")

const moment = require("moment-timezone");
const nodemailer = require("nodemailer");
const cron = require("node-cron");

async function handleSendReminder(req, res) {
    try {
        const pool = await connectDB()

        let result = await pool.request()
                .query(`SELECT e.*
                        FROM EmployeeMaster e
                        LEFT JOIN DailyEmployeeEntry d 
                            ON e.EmployeeID = d.EmployeeID 
                            AND CAST(d.Date AS DATE) = CAST(GETDATE() AS DATE)
                        WHERE d.EmployeeID IS NULL;`)

        // console.log(result.recordset);

        return result.recordset
    } catch (err) {
        console.log(err)
    }
}

function handleScheduleEmailAndEntry() {
    cron.schedule(
        "00 09 * * *",
        async () => {
            let absentEmployee = await handleSendReminder();

            console.log(absentEmployee);
            
            for(element of absentEmployee) {
                console.log(element.EmployeeEmail)
                handleSendEmail(element.EmployeeEmail, "You are not Present in ICONA")
            }
        },
        {
            scheduled: true,
            timezone: "Asia/Kolkata",
        }
    );
    cron.schedule(
        "00 10 * * *",
        async () => {
            let absentEmployee = await handleSendReminder();

            console.log(absentEmployee);
            
            for(element of absentEmployee) {
                console.log(element.EmployeeEmail)
                handleSendEmail(element.EmployeeEmail, "You are not Present in ICONA")
            }
        },
        {
            scheduled: true,
            timezone: "Asia/Kolkata",
        }
    );
    cron.schedule(
        "00 11 * * *",
        async () => {
            let absentEmployee = await handleSendReminder();

            console.log(absentEmployee);
            
            for(element of absentEmployee) {
                console.log(element.EmployeeEmail)
                handleSendEmail(element.EmployeeEmail, "This is your last reminder for attendance at ICONA \n After 5 minutes you will be automatically marked absent today")
            }
        },
        {
            scheduled: true,
            timezone: "Asia/Kolkata",
        }
    );
    cron.schedule(
        "00 12 * * *",
        async () => {
            let absentEmployee = await handleSendReminder();

            console.log(absentEmployee);
            let currentISTDate = moment.tz('Asia/Kolkata').format('YYYY-MM-DD');
            for(element of absentEmployee) {
                let EmployeeID = element.EmployeeID
                let EmployeeName = element.EmployeeName
                try {
                    const pool = await connectDB();
                    // console.log(element.EmployeeEmail)
                    const result2 = await pool.request()
                            .input('EmployeeID', sql.Int, EmployeeID)
                            .input('EmployeeName', sql.VarChar, EmployeeName)
                            .input('currentISTDate', sql.Date, currentISTDate)
                            .query("INSERT INTO DailyEmployeeEntry (EmployeeID, EmployeeName, JobCategory, Date) VALUES (@EmployeeID, @EmployeeName, 'ABSENT', @currentISTDate)");
                } catch (err) {
                    console.log(err)
                }
            }
        },
        {
            scheduled: true,
            timezone: "Asia/Kolkata",
        }
    );
}

module.exports = {
    handleSendReminder,
    handleScheduleEmailAndEntry,
}
