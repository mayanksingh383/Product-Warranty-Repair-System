
const express = require("express");
const router = express.Router();

const {
    createCustomer,
    getCustomers,
    deleteCustomer
} = require("../controllers/customerController");

// Create customer
router.post("/", createCustomer);

// Get all customers
router.get("/", getCustomers);

// Delete customer by MongoDB ID
router.delete("/:id", deleteCustomer);

module.exports = router;

