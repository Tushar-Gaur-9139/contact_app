const express = require('express');
const router = express.Router();
const { getContacts, addContact, deleteContact, updateContact,getSingleContact } = require('../controllers/contactController');

router.get('/contacts', getContacts);
router.post('/contacts', addContact);
router.delete('/contacts/:id', deleteContact);
router.put('/contacts/:Id', updateContact);
router.get('/getContact/:Id', getSingleContact);


module.exports = router;
