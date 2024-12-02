// Importing necessary libraries
const mongoose = require('mongoose');  // Mongoose is used to interact with MongoDB
const bcrypt = require('bcryptjs');    // Bcrypt is used for hashing and comparing passwords securely

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  googleId: {
    type: String, // Google ID will be populated if the user signs up using Google OAuth
  },
  displayName: {
    type: String, // Display name will be populated if the user signs up using Google OAuth
  },
  email: {
    type: String,
    required: true, // Email is required for every user
    unique: true,   // Ensures that the email address is unique in the database
  },
  password: {
    type: String,  // The password field is used for email/password-based signups
  },
  photo: {
    type: String, // Photo will be populated if the user signs up using Google OAuth
  },
});

// Middleware to hash the password before saving the user document to MongoDB
userSchema.pre('save', async function (next) {
  // This hook runs before the document is saved to the database
  // It checks if the password is set and modified
  if (this.password && this.isModified('password')) {
    // Hash the password with bcrypt before saving
    this.password = await bcrypt.hash(this.password, 10); // 10 is the salt rounds for bcrypt
  }
  next(); // Continue with the save operation
});

// Method to compare the provided password with the stored hashed password
userSchema.methods.comparePassword = function (candidatePassword) {
  // bcrypt.compare() compares the candidate password with the stored hashed password
  return bcrypt.compare(candidatePassword, this.password);
};


const User = mongoose.model('User', userSchema); // Create User model using the schema defined above
module.exports = User; 