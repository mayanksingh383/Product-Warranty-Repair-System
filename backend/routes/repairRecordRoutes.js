
const express = require("express");
const router = express.Router();

const {
    createRepairRecord,
    getRepairRecords
} = require("../controllers/repairRecordController");

// Create a repair record
router.post("/", createRepairRecord);

// Get all repair records
router.get("/", getRepairRecords);

module.exports = router;
