
const mongoose = require("mongoose");

const repairPartSchema = new mongoose.Schema(
    {
        repair_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RepairRecord",
            required: true
        },

        part_name: {
            type: String,
            required: true,
            trim: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        unit_cost: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("RepairPart", repairPartSchema);
