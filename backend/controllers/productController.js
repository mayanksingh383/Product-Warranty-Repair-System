
const Product = require("../models/Product");

// CREATE PRODUCT
const createProduct = async (req, res) => {
    try {
        const {
            product_name,
            brand,
            category,
            model_number,
            standard_warranty_months
        } = req.body;

        if (
            !product_name ||
            !brand ||
            !model_number ||
            standard_warranty_months === undefined
        ) {
            return res.status(400).json({
                message: "Please provide all required product details"
            });
        }

        const existingProduct = await Product.findOne({ model_number });

        if (existingProduct) {
            return res.status(409).json({
                message: "Product model already exists"
            });
        }

        const product = await Product.create({
            product_name,
            brand,
            category,
            model_number,
            standard_warranty_months
        });

        return res.status(201).json({
            message: "Product created successfully",
            product
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error creating product",
            error: error.message
        });
    }
};

// GET ALL PRODUCTS
const getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        return res.status(200).json(products);

    } catch (error) {
        return res.status(500).json({
            message: "Error fetching products",
            error: error.message
        });
    }
};

module.exports = {
    createProduct,
    getProducts
};
