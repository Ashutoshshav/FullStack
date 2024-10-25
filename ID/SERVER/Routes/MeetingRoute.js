const express = require("express")

const { handleGetNextMeeting, handleSetMeetingSchedule, handleGetFreeMeetSchedule } = require('../Controllers/MeetingControllers')

const router = express.Router()

router.get("/employeemeeting", handleGetNextMeeting)
router.post("/schedulemeeting", handleSetMeetingSchedule)
router.post("/freemeetschedule", handleGetFreeMeetSchedule)

module.exports = router
