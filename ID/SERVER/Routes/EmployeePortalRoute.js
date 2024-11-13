const express = require("express");
const multer = require("multer");

// Multer configuration to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

const {
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
} = require("../Controllers/EmployeePortalController");

const router = express.Router();

router.get("/allwork", handleGetWork);
router.post("/workdata", handleWorkInfo);
router.post("/assignwork", handleWorkAssignMe);
router.post("/timein", handleEmployeeTimeIn);
router.post("/timeout", handleEmployeeTimeOut);
router.get("/logstatus", handleEmployeeLoggedStatus);
router.post("/startwork", handleWorkStart);
router.get("/jobcategory", handleGetJobCategory);
router.post("/site-image", upload.array('employeeImage'), handlePostSiteImage);
router.get("/allemployee", handleGetAllEmployee);

module.exports = router;
