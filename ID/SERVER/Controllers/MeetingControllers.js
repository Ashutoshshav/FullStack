const { connectDB, sql } = require("../Utils/Connection");
const moment = require("moment-timezone");

async function handleGetNextMeeting(req, res) {
    let EmployeeID = req.employee.id
    // console.log(req.employee);

    try {
        const pool = await connectDB()
        let result = await pool.request()
    .input('EmployeeID', sql.Int, EmployeeID)
    .query("SELECT * FROM MeetingMaster WHERE EmployeeID = @EmployeeID AND MeetingDTime >= SYSDATETIMEOFFSET()")


        // console.log(result)
        return res.send(result.recordset)
    } catch (err) {
        console.log(err);
    }
}

async function handleSetMeetingSchedule(req, res) {
    let EmployeeID = req.employee.id
    console.log(req.employee);
    const currentDateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    let { meetingLocation, meetingDescription, meetingDTime } = req.body
    console.log(meetingLocation, meetingDescription, meetingDTime)
    try {
        const pool = await connectDB()
        const result2 = await pool.request()
                    .input('EmployeeID', sql.Int, EmployeeID)
                    .input('meetingLocation', sql.VarChar, meetingLocation)
                    .input('meetingDescription', sql.VarChar, meetingDescription)
                    .input('currentDateTime', sql.DateTimeOffset, currentDateTime)
                    .input('meetingDTime', sql.DateTimeOffset, meetingDTime)
                    .query(`INSERT INTO MeetingMaster (EmployeeID, MeetingLocation, MeetingDescription, AssignedDTime, MeetingDTime) VALUES (@EmployeeID, @meetingLocation, @meetingDescription, @currentDateTime, @meetingDTime)`)

        return res.status(200).send({ success: "Meeting Schedulled" })
    } catch (err) {
        console.log(err);
    }
}

async function handleGetFreeMeetSchedule(req, res) {
    let EmployeeID = req.employee.id
    console.log(req.employee);
    
    let { nDay } = req.body
    console.log(nDay)
    try {
        const pool = await connectDB()
        const result = await pool.request()
                    .input('EmployeeID', sql.Int, EmployeeID)
                    .input('nDay', sql.Int, nDay)
                    .query(`
            DECLARE @DaysAhead INT = @nDay;

            WITH EmployeeMeetings AS (
                SELECT 
                    MeetingID, 
                    MeetingDTime,
                    CASE 
                        WHEN CAST(MeetingDTime AS TIME) BETWEEN '09:00:00' AND '13:00:00' THEN 'First Half'
                        WHEN CAST(MeetingDTime AS TIME) BETWEEN '13:00:00' AND '18:00:00' THEN 'Second Half'
                        ELSE 'Outside Work Hours'
                    END AS MeetingSlot
                FROM MeetingMaster
                WHERE EmployeeID = @EmployeeID
                  AND CAST(MeetingDTime AS TIME) BETWEEN '09:00:00' AND '18:00:00'
                  AND CAST(MeetingDTime AS DATE) BETWEEN CAST(GETDATE() AS DATE) AND CAST(DATEADD(DAY, @DaysAhead, GETDATE()) AS DATE)
            )
            
            SELECT 
                MeetingDate,
                CASE 
                    WHEN MAX(CASE WHEN MeetingSlot = 'First Half' THEN 1 ELSE 0 END) = 0 THEN 'Available'
                    ELSE 'Booked'
                END AS FirstHalfStatus,
                CASE 
                    WHEN MAX(CASE WHEN MeetingSlot = 'Second Half' THEN 1 ELSE 0 END) = 0 THEN 'Available'
                    ELSE 'Booked'
                END AS SecondHalfStatus
            FROM (
                SELECT CAST(DATEADD(DAY, n, CAST(GETDATE() AS DATE)) AS DATE) AS MeetingDate
                FROM (SELECT TOP (@DaysAhead) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) - 1 AS n FROM sys.objects) AS Numbers
            ) AS Dates
            LEFT JOIN EmployeeMeetings ON CAST(EmployeeMeetings.MeetingDTime AS DATE) = Dates.MeetingDate
            GROUP BY MeetingDate
            ORDER BY MeetingDate;
        `)
            
        console.log(result);
        
        return res.status(200).send(result.recordset)
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    handleGetNextMeeting,
    handleSetMeetingSchedule,
    handleGetFreeMeetSchedule,
}
