
const ProductRegistration = require("../models/ProductRegistration");
const Customer = require("../models/Customer");
const Product = require("../models/Product");

// CREATE PRODUCT REGISTRATION
const createRegistration = async (req, res) => {
    try {
        const {
            customer_id,
            product_id,
            serial_number,
            purchase_date,
            warranty_start_date,
            warranty_end_date,
            purchase_store,
            purchase_price
        } = req.body;

        if (
            !customer_id ||
            !product_id ||
            !serial_number ||
            !purchase_date ||
            !warranty_start_date ||
            !warranty_end_date
        ) {
            return res.status(400).json({
                message: "Please provide all required registration details"
            });
        }

        const customer = await Customer.findById(customer_id);
        const product = await Product.findById(product_id);

        if (!customer || !product) {
            return res.status(404).json({
                message: "Customer or product not found"
            });
        }

        if (new Date(warranty_end_date) < new Date(warranty_start_date)) {
            return res.status(400).json({
                message: "Warranty end date cannot be before start date"
            });
        }

        const existingRegistration =
            await ProductRegistration.findOne({ serial_number });

        if (existingRegistration) {
            return res.status(409).json({
                message: "Serial number already registered"
            });
        }

        const registration = await ProductRegistration.create({
            customer_id,
            product_id,
            serial_number,
            purchase_date,
            warranty_start_date,
            warranty_end_date,
            purchase_store,
            purchase_price
        });

        res.status(201).json({
            message: "Product registered successfully",
            registration
        });

    } catch (error) {
        res.status(500).json({
            message: "Error registering product",
            error: error.message
        });
    }
};

// GET ALL REGISTRATIONS
const getRegistrations = async (req, res) => {
    try {
        const registrations = await ProductRegistration.find()
            .populate("customer_id")
            .populate("product_id")
            .sort({ createdAt: -1 });

        res.status(200).json(registrations);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching registrations",
            error: error.message
        });
    }
};

module.exports = {
    createRegistration,
    getRegistrations
};
