
const mongoose = require("mongoose");

const warrantyClaimSchema = new mongoose.Schema(
    {
        registration_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProductRegistration",
            required: true
        },

        service_centre_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ServiceCentre"
        },

        claim_date: {
            type: Date,
            default: Date.now
        },

        issue_description: {
            type: String,
            required: true,
            trim: true
        },

        claim_type: {
            type: String,
            enum: ["Repair", "Replacement", "Refund"],
            required: true
        },

        claim_status: {
            type: String,
            enum: ["Pending", "Under Review", "Approved", "Rejected", "Completed"],
            default: "Pending"
        },

        decision_date: {
            type: Date
        },

        resolution_notes: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("WarrantyClaim", warrantyClaimSchema);
