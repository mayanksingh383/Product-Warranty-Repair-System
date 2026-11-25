
const express = require("express");
const router = express.Router();

const {
    createRepairPart,
    getRepairParts
} = require("../controllers/repairPartController");

// Add a repair part
router.post("/", createRepairPart);

// Get all repair parts
router.get("/", getRepairParts);

module.exports = router;
