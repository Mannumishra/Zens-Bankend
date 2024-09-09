const Contact = require('../models/Contact');
const { userEmailTemplate, adminEmailTemplate } = require('../utils/conatctMailTemplate');
const { transporter } = require('../utils/mailTransporter');

const createContact = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        const errors = [];
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
        const newContact = new Contact({ name, email, phone, subject, message });
        const savedContact = await newContact.save();
        // Send confirmation email to the user
        await transporter.sendMail({
            from: process.env.MAIL_SEND, // Replace with your email
            to: email,
            subject: 'Zens - Thank You for Contacting Us!',
            html: userEmailTemplate(name)
        });

        // Send notification email to the admin
        await transporter.sendMail({
            from: process.env.MAIL_SEND, // Replace with your email
            to: process.env.MAIL_SEND, // Replace with admin email
            subject: 'Zens - New Contact Submission',
            html: adminEmailTemplate(name, email, phone, subject, message)
        });
        res.status(200).json({ success: true, message: 'Contact submission created successfully.', contact: savedContact });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json({ success: true, contacts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

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