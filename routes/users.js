const express = require('express');
const {body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

const Router = express.Router();

const User = require('../modals/User');

Router.post('/',[
    body('name','Plese enter a name').notEmpty(),
    body('password','Password is required').isLength({ min:6 }),
    body('email','Please enter an email').isEmail()
],
async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
   
  const { name, email, password } = req.body;

  try {

        let user = await User.findOne({email});

        if(user){
            return res.status(400).json({msg:"user already exists"});
        }

        user = new User({
            name,
            email,
            password
        })

        const salt = bcrypt.genSaltSync(10);
        
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        // Create JWT

        const payload = {
            user : {
                id : user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn : 36000000
        }, (err, token) => {

            if(err) throw err;

            res.json({token})
        });

    } catch (err) {
      
        console.error(err,'error from post users');
        res.status(500).json({ msg:"server error" });
  }

});

module.exports = Router;