const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

const User = require('../modals/User');
const auth = require('../middleware/auth');
const Router = express.Router();
 
// load user
Router.get('/', auth, async (req, res) => {

    try {
        
        const user = await User.findById(req.user.id).select('-password')

        res.json({user})

    } catch (err) {

        res.status(500).json({msg:'get logged in user'});

    }
    
});

// login user
Router.post('/',async (req, res) => {

    const { email, password } = req.body;

    try {

        const user = await User.findOne({email});
        
        if(!user){

        return res.status(400).send("Invalid Credentials");

        }

        const isValid = bcrypt.compareSync(password, user.password);

        if(!isValid){

            return res.status(400).send("Invalid Credentials");

        }

        // create JWT

        const payload = {
            user : {
                id : user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: 36000000
        }, (err, token) => {

            if(err) throw err;

            res.json({token});

        });

    } catch (err) {
        console.error(err,"from auth post login");
        res.status(500).json({msg:"server error"});
    }
});

module.exports = Router;