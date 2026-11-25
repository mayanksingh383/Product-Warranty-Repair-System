
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const connectDB = require("./config/db");

// Import routes
const customerRoutes = require("./routes/customerRoutes");
const productRoutes = require("./routes/productRoutes");
const productRegistrationRoutes = require("./routes/productRegistrationRoutes");
const serviceCentreRoutes = require("./routes/serviceCentreRoutes");
const warrantyClaimRoutes = require("./routes/warrantyClaimRoutes");
const repairPartRoutes = require("./routes/repairPartRoutes");
const repairRecordRoutes = require("./routes/repairRecordRoutes");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test API
app.get("/", (req, res) => {
    res.send("Warranty Repair Backend is Running!");
});

// API Routes
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/registrations", productRegistrationRoutes);
app.use("/api/service-centres", serviceCentreRoutes);
app.use("/api/warranty-claims", warrantyClaimRoutes);
app.use("/api/repair-records", repairRecordRoutes);
app.use("/api/repair-parts", repairPartRoutes);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();



