const express = require("express");
const router = express.Router();

const {
    createServiceCentre,
    getServiceCentres
} = require("../controllers/serviceCentreController");

router.post("/", createServiceCentre);
router.get("/", getServiceCentres);

module.exports = router;


