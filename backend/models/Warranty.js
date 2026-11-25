
const mongoose = require("mongoose");

const warrantySchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        warrantyNumber: {
            type: String,
            required: true,
            unique: true
        },

        warrantyStartDate: {
            type: Date,
            required: true
        },

        warrantyEndDate: {
            type: Date,
            required: true
        },

        warrantyType: {
            type: String,
            enum: ["Standard", "Extended"],
            default: "Standard"
        },

        status: {
            type: String,
            enum: ["Active", "Expired", "Claimed"],
            default: "Active"
        },

        termsAndConditions: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Warranty", warrantySchema);
