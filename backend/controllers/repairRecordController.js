
const RepairRecord = require("../models/RepairRecord");
const WarrantyClaim = require("../models/WarrantyClaim");

// Create a new repair record
const createRepairRecord = async (req, res) => {
    try {
        const {
            claim_id,
            diagnosis,
            repair_action,
            labour_cost
        } = req.body;

        // Validate required fields
        if (!claim_id || !diagnosis) {
            return res.status(400).json({
                message: "Claim ID and diagnosis are required."
            });
        }

        // Check whether warranty claim exists
        const claim = await WarrantyClaim.findById(claim_id);

        if (!claim) {
            return res.status(404).json({
                message: "Warranty claim not found."
            });
        }

        // Create repair record
        const repairRecord = await RepairRecord.create({
            claim_id,
            diagnosis,
            repair_action,
            labour_cost
        });

        res.status(201).json({
            message: "Repair record created successfully!",
            repairRecord
        });

    } catch (error) {
        res.status(500).json({
            message: "Error creating repair record",
            error: error.message
        });
    }
};

// Get all repair records
const getRepairRecords = async (req, res) => {
    try {
        const repairRecords = await RepairRecord.find()
            .populate("claim_id")
            .sort({ createdAt: -1 });

        res.status(200).json(repairRecords);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching repair records",
            error: error.message
        });
    }
};

module.exports = {
    createRepairRecord,
    getRepairRecords
};
