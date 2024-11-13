const express = require("express");

const {
  handleWorkAssigning,
  handleGetAllWork,
  handleGetSiteImage,
  handleGetDailyEmployeeEntry,
  handleUpdateEmployeeEntry,
} = require("../Controllers/WorkController");

const router = express.Router();

router.post("/assigning", handleWorkAssigning);
router.get("/allworks", handleGetAllWork);
router.get("/site-image", handleGetSiteImage);
router.get("/daily-entry", handleGetDailyEmployeeEntry);
router.put("/update-employee-entry", handleUpdateEmployeeEntry)

module.exports = router;
