
// models/Contact.js

const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        // trim: true
    },
    email: {
        type: String,
        required: true,
        // trim: true,
        // match: [/.+\@.+\..+/, "Please enter a valid email address"]
    },
    phone: {
        type: String,
        required: true,
        // trim: true,
        // match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"]
    },
    subject: {
        type: String,
        required: true,
        // trim: true
    },
    message: {
        type: String,
        required: true,
        // trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Contact', contactSchema);
