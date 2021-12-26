const jwt = require('jsonwebtoken');
const config = require('config');

// const User = require('../modals/User');

module.exports = async function auth(req, res, next) {

    const token = await req.header('x-auth-token');

    if (! token) {

        return res.status(401).json({msg:'unauthorized access'});

    }

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        req.user = decoded.user;

        next();

    } catch (err) {

        console.error(err, "from auth middleware")
        res.status(401).json({msg:'unauthorized access'});

    }

}
