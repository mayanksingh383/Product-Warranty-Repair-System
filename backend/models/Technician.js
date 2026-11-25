
const mongoose = require("mongoose");

const technicianSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },

        phone: {
            type: String,
            required: true
        },

        specialization: {
            type: String,
            required: true
        },

        experience: {
            type: Number,
            default: 0
        },

        availability: {
            type: String,
            enum: ["Available", "Busy", "Unavailable"],
            default: "Available"
        },

        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Technician", technicianSchema);
