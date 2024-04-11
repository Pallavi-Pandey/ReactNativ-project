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


const User = require('./models/user');
const Order = require('./models/order');

//function to send verification email to the user
const sendVerificationEmail = async (email, verificationToken) => {

    //create a nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'pallavipandey181@gmail.com',
            pass: 'gvum vezk ydvg ofow'
        }
    })

    //compose the email message
    const mailOptions = {
        from: 'amazon.com',
        to: email,
        subject: 'Verify your email',
        text: `Click on the link to verify your email: http://192.168.43.194:8000/verify/${verificationToken}`
    };

    //send the email
    try{
        await transporter.sendMail(mailOptions);
        console.log("Verification email sent");
    }catch(error){
        console.log("Error sending verification email", error);
    }
}

    //endpoint to registerin the app
    app.post('/register', async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }
            const newUser = new User({
                name,
                email,
                password
            });

            newUser.verificationToken = crypto.randomBytes(20).toString('hex');

            await newUser.save();

            sendVerificationEmail(newUser.email, newUser.verificationToken);
            res.status(201).json({message:"User registered successfully. Please verify your email to login"})


             console.log("email sent")
        } catch (error) {
            console.log("Error registring the user ", error);
            res.status(500).json({ message: "Registration failed" });
        }
    });

    //endpoint to verify the user email
    app.get('/verify/:token', async (req, res) => {
        try {
            const token = req.params.token;
            const user = await User.findOne({ verificationToken: token });
            if (!user) {
                return res.status(404).json({ message: "Invalid verification token" });
            }
            user.verified = true;
            user.verificationToken = undefined;

            await user.save();

            res.status(200).json({ message: "Email verified successfully" });
        }catch(error){
            res.status(500).json({ message: "Email Verification failed" });
        }
    });