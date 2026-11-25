
const ServiceCentre = require("../models/ServiceCentre");

// CREATE SERVICE CENTRE
const createServiceCentre = async (req, res) => {
    try {
        const {
            centre_name,
            city,
            address,
            phone,
            email
        } = req.body;

        if (!centre_name || !city || !address || !phone) {
            return res.status(400).json({
                message: "Please provide all required service centre details"
            });
        }

        const serviceCentre = await ServiceCentre.create({
            centre_name,
            city,
            address,
            phone,
            email
        });

        return res.status(201).json({
            message: "Service centre created successfully",
            serviceCentre
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error creating service centre",
            error: error.message
        });
    }
};

// GET ALL SERVICE CENTRES
const getServiceCentres = async (req, res) => {
    try {
        const serviceCentres = await ServiceCentre.find().sort({
            createdAt: -1
        });

        return res.status(200).json(serviceCentres);

    } catch (error) {
        return res.status(500).json({
            message: "Error fetching service centres",
            error: error.message
        });
    }
};

module.exports = {
    createServiceCentre,
    getServiceCentres
};
