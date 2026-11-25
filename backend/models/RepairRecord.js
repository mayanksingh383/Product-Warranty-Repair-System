
const mongoose = require("mongoose");

const repairRecordSchema = new mongoose.Schema(
    {
        claim_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WarrantyClaim",
            required: true
        },

        received_date: {
            type: Date,
            default: Date.now
        },

        completed_date: {
            type: Date
        },

        diagnosis: {
            type: String,
            required: true,
            trim: true
        },

        repair_action: {
            type: String,
            trim: true
        },

        labour_cost: {
            type: Number,
            min: 0,
            default: 0
        },

        repair_status: {
            type: String,
            enum: ["Received", "In Progress", "Completed", "On Hold"],
            default: "Received"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("RepairRecord", repairRecordSchema);
