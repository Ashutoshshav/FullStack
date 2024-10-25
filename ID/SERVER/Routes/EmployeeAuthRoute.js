const express = require("express")

const { handleEmployeeSignup, handleEmployeeLogin } = require('../Controllers/EmployeeAuthController')

const router = express.Router()

router.post("/signup", handleEmployeeSignup)
router.post("/login", handleEmployeeLogin)

module.exports = router
