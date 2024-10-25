const express = require("express")

const { handleWorkAssigning, handleGetAllWork } = require('../Controllers/WorkController')

const router = express.Router()

router.post("/assigning", handleWorkAssigning)
router.get("/allworks", handleGetAllWork)

module.exports = router
