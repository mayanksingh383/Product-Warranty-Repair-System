
const RepairPart = require("../models/RepairPart");
const RepairRecord = require("../models/RepairRecord");

// Create a new repair part
const createRepairPart = async (req, res) => {
    try {
        const {
            repair_id,
            part_name,
            quantity,
            unit_cost
        } = req.body;

        // Validate required fields
        if (!repair_id || !part_name || !quantity || unit_cost === undefined) {
            return res.status(400).json({
                message: "Repair ID, part name, quantity and unit cost are required."
            });
        }

        // Check whether repair record exists
        const repairRecord = await RepairRecord.findById(repair_id);

        if (!repairRecord) {
            return res.status(404).json({
                message: "Repair record not found."
            });
        }

        // Create repair part
        const repairPart = await RepairPart.create({
            repair_id,
            part_name,
            quantity,
            unit_cost
        });

        res.status(201).json({
            message: "Repair part added successfully!",
            repairPart
        });

    } catch (error) {
        res.status(500).json({
            message: "Error adding repair part",
            error: error.message
        });
    }
};

// Get all repair parts
const getRepairParts = async (req, res) => {
    try {
        const repairParts = await RepairPart.find()
            .populate("repair_id")
            .sort({ createdAt: -1 });

        res.status(200).json(repairParts);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching repair parts",
            error: error.message
        });
    }
};

module.exports = {
    createRepairPart,
    getRepairParts
};
