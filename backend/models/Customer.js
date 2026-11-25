
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
    {
        full_name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            maxlength: 150
        },

        phone: {
            type: String,
            maxlength: 20
        },

        city: {
            type: String,
            maxlength: 80
        }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    }
);

module.exports = mongoose.model("Customer", customerSchema);

