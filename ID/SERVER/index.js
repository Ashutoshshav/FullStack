const express = require("express");
const sql = require('mssql');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
require('iisnode-env').config();

const app = express();
const { connectDB } = require("./Utils/Connection");
const { handleVerifyEmployee } = require("./Middlewares/EmployeeTokenVerify")

const employeeAuthRoute = require("./Routes/EmployeeAuthRoute")
const workRoute = require("./Routes/WorkRoute")
const employeePortalRoute = require("./Routes/EmployeePortalRoute")
const meetingRoute = require("./Routes/MeetingRoute")

const port = process.env.PORT || 5000;

// Middleware configurations
app.use(cors({
    origin: ["http://192.168.0.252:5000", "http://localhost:5000", "http://localhost:5174"], // Allowed origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
    credentials: true // Allow credentials if needed
}));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'public', 'dist')));

// API routes
app.use("/api/employee/", employeeAuthRoute)
app.use("/api/work/", handleVerifyEmployee(['Admin']), workRoute)
app.use("/api/empolyeeportal/", handleVerifyEmployee(['Admin', 'Employee', 'Developer']), employeePortalRoute)
app.use("/api/meeting", handleVerifyEmployee(['Admin', 'Employee', 'Developer']), meetingRoute)

// Catch-all handler for any requests that don’t match an API route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dist', 'index.html'));
});

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log("Server is running on " + port);
});
