const express = require("express")

const { handleInvoiceManagement, handleSetCustInvoice, handleGenerateInvoicePDF } = require("../Controllers/InvoiceControllers")

const router = express.Router()

router.get("/generation", handleInvoiceManagement)
router.get("/generated", handleSetCustInvoice)
router.get("/generateInvoice", handleGenerateInvoicePDF)

module.exports = router
