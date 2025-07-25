// backend/routes/itemRoutes.js
const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const User = require('../models/Item');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
require('dotenv').config();
// Store OTPs temporarily (in production, use Redis or similar)
const otpStore = new Map();

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Replace with your email
    pass: process.env.EMAIL_PASS
  }
});

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP route
router.post('/send-otp', async (req, res) => {
  const { email, name } = req.body;
  
  try {
    const otp = generateOTP();
    otpStore.set(email, { otp, timestamp: Date.now() });

    const mailOptions = {
      from: 'anki88520@gmail.com', // Changed to match your sender email
      to: email,
      subject: 'Your OTP for LoanManager Registration',
      html: `
        <h1>Welcome to LoanManager</h1>
        <p>Hello ${name},</p>
        <p>Your OTP for registration is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 10 minutes.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('OTP sent:', otp); // Add this for debugging
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// Verify OTP route
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  
  const storedData = otpStore.get(email);
  console.log('Stored OTP:', storedData?.otp); // Add this for debugging
  console.log('Received OTP:', otp); // Add this for debugging

  if (!storedData) {
    return res.status(400).json({ message: 'OTP expired or not found' });
  }

  if (storedData.otp === otp && (Date.now() - storedData.timestamp) < 600000) {
    otpStore.delete(email);
    res.status(200).json({ message: 'OTP verified successfully' });
  } else {
    res.status(400).json({ message: 'Invalid OTP' });
  }
});

// Register route
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  
  try {
    // Check if user already exists
    const existingUser = await Item.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with this email' 
      });
    }

    // Create new user
    const user = new Item({
      fullName: name,
      email,
      password
    });

    // Save user to database
    await user.save();

    // Return success without password
    res.status(201).json({ 
      message: 'User registered successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;