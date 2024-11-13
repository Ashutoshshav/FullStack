const express = require("express")

const {handleSendReminder } = require('../Controllers/ReminderController')

const router = express.Router()

router.get("/send-reminder", handleSendReminder)

module.exports = router
