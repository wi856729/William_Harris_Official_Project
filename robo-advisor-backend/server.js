// Importing required libraries
const express = require('express');  // Express.js for building the server
const dotenv = require('dotenv');  // dotenv for loading environment variables
const passport = require('passport');  // Passport.js for authentication middleware
const session = require('express-session');  // Express-session for managing sessions
const cors = require('cors');  // CORS middleware to handle cross-origin requests
const mongoose = require('mongoose');  // Mongoose for MongoDB object modeling
const jwt = require('jsonwebtoken');  // JSON Web Token for authentication and session handling

// Custom modules
const connectDB = require('./config/db');  // Custom function to connect to MongoDB
const portfolioRoutes = require('./routes/portfolioRoutes');  // Import portfolio routes
const authRoutes = require('./routes/authRoutes');  // Import authentication routes
const GoogleStrategy = require('passport-google-oauth20').Strategy;  // Google OAuth strategy for Passport
const User = require('./models/User');  // Import User model for database interactions

// Load environment variables from a .env file
dotenv.config();

// Connect to MongoDB using the custom connectDB function
connectDB();

// Create an instance of the Express app
const app = express();

// CORS configuration: Allow frontend on localhost:3002 to make requests
const corsOptions = {
  origin: 'http://localhost:3002',  // Only allow requests from this specific origin (frontend)
  credentials: true,  // Allow sending cookies and sessions with requests
};

// Middleware setup
app.use(express.json());  // Middleware to parse incoming JSON request bodies
app.use(cors(corsOptions));  // Enable CORS with the specified configuration
app.use(session({
  secret: process.env.SESSION_SECRET,  // Secret key to sign the session ID cookie
  resave: false,  // Don't resave session if it's unchanged
  saveUninitialized: true,  // Save new sessions, even if not modified
}));
app.use(passport.initialize());  // Initialize Passport for handling authentication
app.use(passport.session());  // Use Passport session to manage user login state

// Google OAuth Strategy for Passport
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,  // Client ID from Google Developer Console
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,  // Client secret from Google Developer Console
  callbackURL: 'http://localhost:5000/auth/google/callback',  // URL where Google will redirect after authentication
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if a user with the given Google ID already exists in the database
    let user = await User.findOne({ googleId: profile.id });

    // If the user doesn't exist, create a new user
    if (!user) {
      user = new User({
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        photo: profile.photos ? profile.photos[0].value : '',
      });
      await user.save();  // Save the new user to the database
    }
    done(null, user);  // Authentication success, pass user to next step
  } catch (err) {
    done(err, null);  // Pass error to the callback if something goes wrong
  }
}));

// Serialize user information into the session (store user ID in session)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user information from the session (retrieve full user object)
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);  // Return user object based on session-stored ID
  });
});

// Regular login route for email/password authentication
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;  // Extract email and password from the request body

  try {
    // Find the user by email in the database
    const user = await User.findOne({ email });

    // Check if the user exists and if the passwords match
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });  // Invalid credentials response
    }

    // Generate a JWT token for authenticated users
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,  // Secret key for signing the token
      { expiresIn: '1h' }  // Token expiration time (1 hour)
    );

    return res.json({ token });  // Return the JWT token to the client
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });  // Internal server error
  }
});

// Routes for authentication and portfolio
app.use('/auth', authRoutes);  // Use authentication routes (login, Google OAuth)
app.use('/api', portfolioRoutes);  // Use portfolio-related routes

// Google OAuth callback route: Google redirects users here after successful authentication
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // If authentication is successful, generate a JWT token
    const jwtToken = jwt.sign(
      { id: req.user._id, displayName: req.user.displayName, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }  // Set token expiration time to 1 hour
    );
    // Redirect to frontend portfolio page with the JWT token in the URL
    res.redirect(`http://localhost:3002/portfolio?token=${jwtToken}`);
  }
);

// Example portfolio route
app.get('/api/portfolio', (req, res) => {
  res.json({ message: 'Portfolio data goes here' });  // Return a placeholder message for portfolio data
});

// Start the server on the specified port
const PORT = process.env.PORT || 5000;  // Use environment variable PORT or default to 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);  // Log message indicating the server is running
});