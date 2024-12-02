// Importing necessary libraries
const express = require('express');  // Express.js for building the web server
const { OAuth2Client } = require('google-auth-library');  // Google Auth client for verifying OAuth tokens
const jwt = require('jsonwebtoken');  // JWT for creating and verifying JSON Web Tokens
const bcrypt = require('bcryptjs');  // Bcrypt for hashing and comparing passwords securely
const User = require('../models/User');  // User model to interact with the database
const { body, validationResult } = require('express-validator');  // Express Validator for input validation

const router = express.Router();  // Create a new Express Router instance

// Signup route with email/password with input validation
router.post(
  '/signup',
  [
    // Email validation: checks if the email is in a standard format
    body('email').isEmail().withMessage('Invalid email format'),

    // Password validation: ensures the password is at least 6 characters long
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

    // No validation for displayName, as per the user's request for no restrictions on displayName
  ],
  async (req, res) => {
    // Check if there are validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If validation errors exist, return a 400 response with the error details
      return res.status(400).json({ message: 'Validation error', errors: errors.array() });
    }

    // Destructure the request body to extract email, password, and displayName
    const { email, password, displayName } = req.body;

    try {
      // Check if a user already exists with the provided email
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });

      // Hash the password using bcrypt before saving the user
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new User document and save it to the database
      const user = new User({ email, password: hashedPassword, displayName });
      await user.save();

      // Generate a JWT token for the new user
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      // Send the token and a success message back to the client
      res.json({ token, message: 'Signup successful' });
    } catch (error) {
      // Log any errors that occur during signup and send a server error response
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Login route with email/password
router.post('/login', async (req, res) => {
  // Destructure the request body to extract email and password
  const { email, password } = req.body;

  try {
    // Find the user in the database by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User does not exist' });

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate a JWT token for the user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the token and a success message back to the client
    res.json({ token, message: 'Login successful' });
  } catch (error) {
    // Log any errors that occur during login and send a server error response
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Google OAuth login route
router.post('/google', async (req, res) => {
  // Destructure the request body to extract the Google OAuth token
  const { token } = req.body;

  try {
    // Initialize the OAuth2Client with the Google Client ID
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    // Verify the Google ID token to authenticate the user
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // Ensure the token is intended for this client
    });

    // Extract the user's Google ID, email, and display name from the payload
    const { sub: googleId, email, name: displayName } = ticket.getPayload();

    // Check if the user already exists in the database using the Google ID
    let user = await User.findOne({ googleId });

    if (!user) {
      // If the user doesn't exist, create a new user and save to the database
      user = new User({ googleId, email, displayName });
      await user.save();
    }

    // Generate a JWT token for the user
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the token and a success message back to the client
    res.json({ token: jwtToken, message: 'Google OAuth login successful' });
  } catch (error) {
    // Log any errors that occur during Google OAuth login and send an error response
    console.error('Google OAuth error:', error);
    res.status(401).json({ message: 'Invalid Google token' });
  }
});

module.exports = router;