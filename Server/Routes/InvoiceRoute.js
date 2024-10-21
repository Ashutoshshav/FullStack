const express = require("express")

<<<<<<< Updated upstream
const { handleInvoiceManagement, handleSetCustInvoice, handleGenerateInvoicePDF } = require("../Controllers/InvoiceControllers")
=======
const { handleInvoiceManagement, handleSetCustInvoice, handleGenerateInvoicePDF, handleSendInvoiceMail } = require("../Controllers/InvoiceControllers")
>>>>>>> Stashed changes

const router = express.Router()

router.get("/generation", handleInvoiceManagement)
router.get("/generated", handleSetCustInvoice)
router.get("/generateInvoice", handleGenerateInvoicePDF)
<<<<<<< Updated upstream
=======
router.get("/sendinvoice", handleSendInvoiceMail)
>>>>>>> Stashed changes

module.exports = router
