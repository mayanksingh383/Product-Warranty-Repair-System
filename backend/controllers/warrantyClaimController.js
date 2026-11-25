
const WarrantyClaim = require("../models/WarrantyClaim");
const ProductRegistration = require("../models/ProductRegistration");
const ServiceCentre = require("../models/ServiceCentre");

// Create a new warranty claim
const createWarrantyClaim = async (req, res) => {
    try {
        const {
            registration_id,
            service_centre_id,
            issue_description,
            claim_type
        } = req.body;

        // Check required fields
        if (!registration_id || !issue_description || !claim_type) {
            return res.status(400).json({
                message: "Registration ID, issue description and claim type are required."
            });
        }

        // Check whether product registration exists
        const registration = await ProductRegistration.findById(registration_id);

        if (!registration) {
            return res.status(404).json({
                message: "Product registration not found."
            });
        }

        // Check whether service centre exists, if provided
        if (service_centre_id) {
            const serviceCentre = await ServiceCentre.findById(service_centre_id);

            if (!serviceCentre) {
                return res.status(404).json({
                    message: "Service centre not found."
                });
            }
        }

        // Create warranty claim
        const warrantyClaim = await WarrantyClaim.create({
            registration_id,
            service_centre_id: service_centre_id || undefined,
            issue_description,
            claim_type
        });

        res.status(201).json({
            message: "Warranty claim created successfully!",
            warrantyClaim
        });

    } catch (error) {
        res.status(500).json({
            message: "Error creating warranty claim",
            error: error.message
        });
    }
};

// Get all warranty claims
const getWarrantyClaims = async (req, res) => {
    try {
        const warrantyClaims = await WarrantyClaim.find()
            .populate("registration_id")
            .populate("service_centre_id")
            .sort({ createdAt: -1 });

        res.status(200).json(warrantyClaims);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching warranty claims",
            error: error.message
        });
    }
};

module.exports = {
    createWarrantyClaim,
    getWarrantyClaims
};
