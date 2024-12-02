// Import necessary libraries
const passport = require('passport'); // Passport for handling authentication
const GoogleStrategy = require('passport-google-oauth20').Strategy; // Google OAuth 2.0 Strategy from passport-google-oauth20
const User = require('../models/User'); // User model to interact with MongoDB (ensure it's defined in '../models/User')

// Use Google OAuth Strategy with Passport
passport.use(
  new GoogleStrategy(
    {
      // Google OAuth credentials from environment variables
      clientID: process.env.GOOGLE_CLIENT_ID, // Google client ID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Google client secret
      callbackURL: 'http://localhost:5000/auth/google/callback', // URL where Google will send the user after successful authentication
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists in the database based on the Google profile ID
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // If the user doesn't exist, create a new user in the database
          user = new User({
            googleId: profile.id, // Store the Google ID for identifying the user
            displayName: profile.displayName, // Store the display name from the Google profile
            email: profile.emails[0].value, // Store the first email from the Google profile
            photo: profile.photos[0].value, // Store the profile photo URL from the Google profile
          });
          await user.save(); // Save the new user to the database
        }

        // Return the user object to Passport
        return done(null, user); // 'done' is called to pass the user object to the session
      } catch (err) {
        // If an error occurs, pass the error to the 'done' callback
        return done(err);
      }
    }
  )
);

// Serialize the user into the session (store user id)
passport.serializeUser((user, done) => {
  done(null, user.id); // Store only the user id in the session to minimize the session's size
});

// Deserialize the user from the session (retrieve the full user object)
passport.deserializeUser(async (id, done) => {
  try {
    // Find the user by id in the database
    const user = await User.findById(id);
    done(null, user); // Return the user object
  } catch (err) {
    // If an error occurs, pass the error to 'done'
    done(err, null); // Return null if user is not found
  }
});