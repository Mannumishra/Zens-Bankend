// routes/contactRoutes.js

const express = require('express');
const { createContact, getContacts, getContactById, updateContact, deleteContact } = require('../controllers/contactController');
const Contactrouter = express.Router();


// CREATE a new contact
Contactrouter.post('/contacts', createContact);

// READ all contacts
Contactrouter.get('/contacts', getContacts);

// READ a single contact by ID
Contactrouter.get('/contacts/:id', getContactById);

// UPDATE a contact by ID
Contactrouter.put('/contacts/:id', updateContact);

// DELETE a contact by ID
Contactrouter.delete('/contacts/:id', deleteContact);

module.exports = Contactrouter;
