const { connectDB, sql } = require("../Utils/Connection")
const cron = require('node-cron')

async function handleGenerateInvoice() {
    console.log("invoice generated")
}

function scheduleInvoice() {
    cron.schedule('13 12 * * *', () => {
        handleGenerateInvoice()
    }, {
        scheduled: true,
        timezone: "Asia/Kolkata"
    })
}

module.exports = {
    scheduleInvoice
}
