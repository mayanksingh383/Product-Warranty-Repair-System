
const mongoose = require("mongoose");

const repairHistorySchema = new mongoose.Schema(
    {
        repairRequest: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RepairRequest",
            required: true
        },

        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        technician: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Technician"
        },

        repairDescription: {
            type: String,
            required: true
        },

        partsReplaced: [{
            partName: String,
            cost: Number
        }],

        repairCost: {
            type: Number,
            default: 0
        },

        repairDate: {
            type: Date,
            default: Date.now
        },

        completionDate: {
            type: Date
        },

        remarks: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "RepairHistory",
    repairHistorySchema
);
