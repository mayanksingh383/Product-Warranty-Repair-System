
const express = require("express");
const router = express.Router();

const {
    createWarrantyClaim,
    getWarrantyClaims
} = require("../controllers/warrantyClaimController");

// Create a warranty claim
router.post("/", createWarrantyClaim);

// Get all warranty claims
router.get("/", getWarrantyClaims);

module.exports = router;
