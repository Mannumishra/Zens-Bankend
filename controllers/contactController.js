// controllers/contactController.js

const Contact = require('../models/Contact');

// CREATE a new contact submission
const createContact = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        // Array to store validation errors
        const errors = [];

        // Validation checks
        if (!name) {
            errors.push("Name is required");
        }
        if (!email) {
            errors.push("Email is required");
        }
        if (!phone) {
            errors.push("Phone number is required");
        }
        if (!subject) {
            errors.push("Subject is required");
        }
        if (!message) {
            errors.push("Message is required");
        }

        // If there are validation errors, send the errors array in the response
        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors });
        }

        const existingContact = await Contact.findOne({
            $or: [
                { email: email }, { phone: phone }
            ]
        })
        if (existingContact) {
            return res.status(400).json({
                success: false,
                message: existingContact.email === email ? "This email ID already exists." : "This phone number already exists."
            });
        }
        // Create a new contact if no validation errors
        const newContact = new Contact({ name, email, phone, subject, message });
        const savedContact = await newContact.save();

        res.status(200).json({ success: true, message: 'Contact submission created successfully.', contact: savedContact });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


// READ all contact submissions
const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json({ success: true, contacts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// READ a single contact submission by ID
const getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ success: false, message: 'Contact not found.' });
        }
        res.status(200).json({ success: true, contact });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// UPDATE a contact submission by ID
const updateContact = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        const updatedContact = await Contact.findByIdAndUpdate(
            req.params.id,
            { name, email, phone, subject, message },
            { new: true, runValidators: true }
        );

        if (!updatedContact) {
            return res.status(404).json({ success: false, message: 'Contact not found.' });
        }

        res.status(200).json({ success: true, message: 'Contact updated successfully.', contact: updatedContact });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// DELETE a contact submission by ID
const deleteContact = async (req, res) => {
    try {
        const deletedContact = await Contact.findByIdAndDelete(req.params.id);

        if (!deletedContact) {
            return res.status(404).json({ success: false, message: 'Contact not found.' });
        }

        res.status(200).json({ success: true, message: 'Contact deleted successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


module.exports = {
    createContact, getContacts, getContactById, deleteContact, updateContact
}