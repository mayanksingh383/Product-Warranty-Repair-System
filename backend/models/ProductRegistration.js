
const mongoose = require("mongoose");

const productRegistrationSchema = new mongoose.Schema(
    {
        customer_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true
        },

        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        serial_number: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        purchase_date: {
            type: Date,
            required: true
        },

        warranty_start_date: {
            type: Date,
            required: true
        },

        warranty_end_date: {
            type: Date,
            required: true
        },

        purchase_store: {
            type: String
        },

        purchase_price: {
            type: Number,
            min: 0
        },

        registration_status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "ProductRegistration",
    productRegistrationSchema
);
