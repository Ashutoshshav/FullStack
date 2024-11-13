const { connectDB, sql } = require("../Utils/Connection");

const moment = require("moment-timezone");
const axios = require('axios');

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
    let { jobCategory } = req.body;

    console.log(jobCategory);
    
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
                    .query("SELECT * FROM DailyEmployeeEntry WHERE EmployeeID = @empID AND CAST(Date AS DATE) = @currentDate");

                if (timeInCheck.recordset.length > 0) {
                    // If entry exists, return a message saying the employee has already clocked in
                    return res.send({ error: "You have already clocked in today." });
                }

                // const fetchJobName = await pool.request()
                //     .input('jobCategory', sql.Int, jobCategory)
                //     .query("SELECT * FROM JobCategory WHERE JobCateroryNo = @jobCategory");

                // let jobCategoryName = fetchJobName.recordset[0].JobCategoryName
                // console.log(jobCategoryName);

                // If no entry exists, insert the new TimeIn entry
                const result2 = await pool.request()
                    .input('empID', sql.Int, empID)
                    .input('EmployeeName', sql.VarChar, EmployeeName)
                    .input('jobCategory', sql.VarChar, jobCategory)
                    .input('currentDateTime', sql.DateTimeOffset, currentDateTime)
                    .input('currentDate', sql.Date, currentDate)
                    .query("INSERT INTO DailyEmployeeEntry (EmployeeID, EmployeeName, TimeIn, LoggedStatus, JobCategory, Date) VALUES (@empID, @EmployeeName, @currentDateTime, 1, @jobCategory, @currentDate)");

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
                        .query("SELECT * FROM DailyEmployeeEntry WHERE EmployeeID = @empID AND CAST(Date AS DATE) = @currentDate");

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

async function handleWorkStart(req, res) {
    let {workID} = req.body
    let EmployeeID = req.employee.id
    // console.log(req.employee);

    const currentDateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    console.log(workID + "  " + EmployeeID);
    
    try {
        const pool = await connectDB();

        const result = await pool.request()
                        .input('workID', sql.Int, workID)
                        .input('EmployeeID', sql.Int, EmployeeID)
                        .query("SELECT * FROM WorkMaster WHERE EmployeeID = @EmployeeID AND WorkID = @workID");

        // console.log(result.recordset[0].StartDTime);

        if(result.recordset[0].StartDTime) {
            const startDateTime = moment(result.recordset[0].StartDTime);
            const endDateTime = moment(currentDateTime);
            const duration = moment.duration(endDateTime.diff(startDateTime));

            const days = duration.days();
            const hours = duration.hours();
            const minutes = duration.minutes();
            const seconds = duration.seconds();
            // console.log(duration);
            console.log(duration.asHours());

            let compleatingDuration = `${days}d ${hours}h ${minutes}m ${seconds}s`
            console.log(compleatingDuration);

            
            const result2 = await pool.request()
                        .input('EmployeeID', sql.Int, EmployeeID)
                        .input('workID', sql.Int, workID)
                        .input('currentDateTime', sql.DateTimeOffset, currentDateTime)
                        .input('compleatingDuration', sql.VarChar, compleatingDuration)
                        .query(`UPDATE WorkMaster
                                SET EndDTime = @currentDateTime,
                                    CompleatingDuration = @compleatingDuration
                                WHERE EmployeeID = @EmployeeID AND WorkID = @workID`);

                        return res.send({ success: "Work Ended" })
        } else {
            const result2 = await pool.request()
                            .input('EmployeeID', sql.Int, EmployeeID)
                            .input('workID', sql.Int, workID)
                            .input('currentDateTime', sql.DateTimeOffset, currentDateTime)
                            .query("UPDATE WorkMaster SET StartDTime = @currentDateTime WHERE EmployeeID = @EmployeeID AND WorkID = @workID");

                            return res.send({ success: "Work Started" })
        }
    } catch (err) {
        console.log(err);
    }
}

async function handleGetJobCategory(req, res) {
    try {
        const pool = await connectDB();

        const result = await pool.request()
                        .query("SELECT * FROM JobCategory");

        return res.send(result.recordset)
    } catch (err) {
        console.log(err);
    }
}

async function handlePostSiteImage(req, res) {
    const employeeId = req.employee.id; // Extract employee ID from token or session
    const images = req.files;
    const { latitude, longitude } = JSON.parse(req.body.location);
    const currentDateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    let location;
    try {
        // Connect to MSSQL database
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'MyApp/1.0 (contact@example.com)', 
            },
            timeout: 5000, // Optional: set a timeout
        });

        if (response.data && response.data.display_name) {
            console.log(response.data.display_name);
            
            location = response.data.display_name
        } else {
            return 'No address found for these coordinates';
        }
        let pool = await connectDB();
        console.log(latitude, longitude);
        
        for (const file of images) {
            await pool.request()
                .input('EmployeeID', sql.Int, employeeId)
                .input('Latitude', sql.Float, latitude)
                .input('Longitude', sql.Float, longitude)
                .input('currentDateTime', sql.DateTimeOffset, currentDateTime)
                .input('Image', sql.VarBinary, file.buffer) // Store file.buffer for binary data
                .input('location', sql.VarChar, location)
                .query(`
                    INSERT INTO SiteVisitHistory (EmployeeID, SiteImage, SiteLatitude, SiteLongitude, EntryDTime, SiteLocation)
                    VALUES (@EmployeeID, @Image, @Latitude, @Longitude, @currentDateTime, @location)
                `);
        }
        res.json({ message: 'Image uploaded successfully' });
    } catch (err) {
        console.error("Error saving image:", err);
        res.status(500).json({ message: 'Error uploading image' });
    }
}

async function handleEmployeeSiteLocation(req, res) {
    const { latitude, longitude } = req.body;
    const employeeId = req.employee.id;
    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('EmployeeID', sql.Int, req.body.employeeId) // Add this if employee ID is also sent from React
            .input('Latitude', sql.Float, latitude)
            .input('Longitude', sql.Float, longitude)
            .input('Timestamp', sql.DateTimeOffset, new Date())
            .query(`
                INSERT INTO EmployeeLocation (EmployeeID, Latitude, Longitude, Timestamp)
                VALUES (@EmployeeID, @Latitude, @Longitude, @Timestamp)
            `);

        res.status(200).json({ message: "Location saved successfully" });
    } catch (error) {
        console.error("Error saving location:", error);
        res.status(500).json({ error: "Server error" });
    }
}

async function handleGetAllEmployee(req, res) {
    try {
        const pool = await connectDB();

        const result = await pool.request()
                        .query("SELECT * FROM EmployeeMaster");

        console.log(result);
        
        return res.send(result.recordset)
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
    handleWorkStart,
    handleGetJobCategory,
    handlePostSiteImage,
    handleGetAllEmployee,
}
