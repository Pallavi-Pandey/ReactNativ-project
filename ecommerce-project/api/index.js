const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
const port = 8000;
const cors = require('cors');
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const jwt = require('jsonwebtoken');


mongoose.connect('mongodb+srv://pallavipandey181:pallavipandey@cluster0.8cpxjjx.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Database connected');
})
.catch((err) => {
    console.log('Error connecting to database', err);
});

app.listen(port, () => {
    console.log('Server is running on PORT: 8000');
});
    