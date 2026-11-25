
const express = require("express");

const router = express.Router();

const registrationController = require("../controllers/productRegistrationController");

// POST - Register a product
router.post("/", registrationController.createRegistration);

// GET - Get all registrations
router.get("/", registrationController.getRegistrations);

module.exports = router;
