const express = require('express');

const dbConnect = require('./config/db');

const app = express();

const PORT = 5000;

dbConnect();

// Middleware
app.use(express.json({ extended: false }))

app.use('/api/users',require('./routes/users'));
app.use('/api/auth',require('./routes/auth'));
app.use('/api/contacts',require('./routes/contacts'));


app.listen(PORT, () => {
    console.log(`server started at PORT ${PORT}`)
});