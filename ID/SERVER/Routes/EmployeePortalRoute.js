const express = require("express")

const { handleGetWork, handleWorkInfo, handleWorkAssignMe, handleEmployeeTimeIn, handleEmployeeTimeOut, handleEmployeeLoggedStatus, } = require('../Controllers/EmployeePortalController')

const router = express.Router()

router.get("/allwork", handleGetWork)
router.post("/workdata", handleWorkInfo)
router.post("/assignwork", handleWorkAssignMe)
router.post("/timein", handleEmployeeTimeIn)
router.post("/timeout", handleEmployeeTimeOut)
router.get("/logstatus", handleEmployeeLoggedStatus)

module.exports = router