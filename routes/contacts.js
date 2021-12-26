const express = require('express');
const mongoose = require('mongoose');
const {body, validationResult } = require('express-validator');

const Contact = require('../modals/Contact');
const User = require('../modals/User');
const auth = require('../middleware/auth');
const Router = express.Router();

Router.get('/',auth, async (req, res) => {
    try {
        const contacts = await Contact.find({ user: req.user.id }).sort({date: -1});
        res.json(contacts);
    } catch (err) {
        console.error(err,"from get all contacts");
        res.status(500).json({msg:'server error'});
    }
});

Router.post('/', [ auth, 
    body('name','Please enter a contact name').notEmpty()
], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
    
    const {name, email, phone, type} = req.body;

    try {

        const newContact = new Contact({
            name,
            email,
            phone,
            type,
            user: req.user.id
        });

        await newContact.save();

        res.status(201).json(newContact);

    } catch (err) {
        console.error(err,"from post contact route");
        res.status(500).json({msg:'server error'});
    }

});

Router.put('/:id', auth, async (req, res) => {

    const {name, email, phone, type} = req.body;

    const contactFields = {};

    if(name) contactFields.name = name;
    if(email) contactFields.email = email;
    if(phone) contactFields.phone = phone;
    if(type) contactFields.type = type;

    try {
        
        let contact = await Contact.findById(req.params.id);

        if(!contact){
            return res.status(404).json({msg: "Contact not found" });
        }

        if(contact.user.toString() !== req.user.id){
           return res.status(401).json({msg:'unauthorized access'});
        }

        contact = await Contact.findByIdAndUpdate(req.params.id, {
            $set: contactFields
        },{
            new: true
        })

        res.json(contact);

    } catch (err) {
        console.error(err,"from put contact route");
        res.status(500).json({msg:'server error'});
    }
});

Router.delete('/:id', auth, async (req, res) => {
    try {
        
        let contact = await Contact.findById(req.params.id);

        if(!contact){
            return res.status(404).json({msg:"Contact not found"})
        }

        if(contact.user.toString() !== req.user.id){
            return res.status(401).json({msg:"unauthorized access"});
        }

        contact = await Contact.findByIdAndRemove(req.params.id);

        res.json({msg:"Contact removed"});


    } catch (err) {
        console.error(err,"from delete contact route");
        res.status(500).json({msg:'server error'});
    }
});

module.exports = Router;