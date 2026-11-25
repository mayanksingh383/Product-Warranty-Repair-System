
const mongoose = require("mongoose");

const repairRequestSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true
        },

        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        warranty: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Warranty"
        },

        requestNumber: {
            type: String,
            required: true,
            unique: true
        },

        issueDescription: {
            type: String,
            required: true
        },

        issueCategory: {
            type: String,
            enum: [
                "Hardware",
                "Software",
                "Battery",
                "Display",
                "Other"
            ],
            default: "Other"
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Approved",
                "In Progress",
                "Completed",
                "Rejected"
            ],
            default: "Pending"
        },

        requestDate: {
            type: Date,
            default: Date.now
        },

        assignedTechnician: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Technician"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("RepairRequest", repairRequestSchema);
