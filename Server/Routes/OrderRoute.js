const express = require("express")

const { handleDeliverySchedule, handleSubmitOrder } = require("../Controllers/OrderControllers")

const router = express.Router()

//router.get("/deliveryDate", handleDeliveryDate)
router.get("/deliverySchedules", handleDeliverySchedule)
router.post("/submitOrder", handleSubmitOrder)

module.exports = router
