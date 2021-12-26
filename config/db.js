const mongoose = require('mongoose');
const config = require('config');

const db = config.get('mongoURI');

const connectDB = async () => {
    try {

        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log('Database connected...')

    } catch (err) {
        console.log(err.msg, "error with DB connection");
        process.exit(1);
    }

}

module.exports = connectDB;
