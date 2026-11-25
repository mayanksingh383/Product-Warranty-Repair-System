
const Customer = require("../models/Customer");

// CREATE CUSTOMER
const createCustomer = async (req, res) => {
    try {
        const { full_name, email, phone, city } = req.body;

        if (!full_name || !email) {
            return res.status(400).json({
                message: "Name and email are required"
            });
        }

        const existingCustomer = await Customer.findOne({ email });

        if (existingCustomer) {
            return res.status(409).json({
                message: "Customer already exists"
            });
        }

        const customer = await Customer.create({
            full_name,
            email,
            phone,
            city
        });

        res.status(201).json({
            message: "Customer created successfully",
            customer
        });

    } catch (error) {
        res.status(500).json({
            message: "Error creating customer",
            error: error.message
        });
    }
};

// GET ALL CUSTOMERS
const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find().sort({
            created_at: -1
        });

        res.status(200).json(customers);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching customers",
            error: error.message
        });
    }
}; 

const deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        res.status(200).json({
            message: "Customer deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting customer",
            error: error.message
        });
    }
};

module.exports = {
    createCustomer,
    getCustomers,
    deleteCustomer
}; 

