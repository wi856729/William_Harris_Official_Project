const express = require('express');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Custom modules
const connectDB = require('./config/db'); // Assuming you have this to connect to MongoDB
const portfolioRoutes = require('./routes/portfolioRoutes'); // Portfolio routes
const authRoutes = require('./routes/authRoutes'); // Auth routes
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();

// CORS configuration: Allow frontend on localhost:3002 to make requests
const corsOptions = {
  origin: 'http://localhost:3002', // Allow frontend to access this backend
  credentials: true, // Allow sending cookies (like sessions) with requests
};

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(cors(corsOptions)); // Enable CORS with specific configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      user = new User({
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        photo: profile.photos ? profile.photos[0].value : '',
      });
      await user.save();
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Regular login route for email/password
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Routes
app.use('/auth', authRoutes); // Auth routes for login, Google OAuth
app.use('/api', portfolioRoutes); // Portfolio generation routes

// Google OAuth callback
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const jwtToken = jwt.sign(
      { id: req.user._id, displayName: req.user.displayName, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    // Redirect to the portfolio page with JWT token as query parameter
    res.redirect(`http://localhost:3002/portfolio?token=${jwtToken}`);
  }
);

// Example portfolio route
app.get('/api/portfolio', (req, res) => {
  res.json({ message: 'Portfolio data goes here' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});