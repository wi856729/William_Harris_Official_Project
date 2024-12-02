const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define schema
const userSchema = new mongoose.Schema({
  googleId: {
    type: String, // Will be populated if the user signs up using Google OAuth
  },
  displayName: {
    type: String, // Will be populated if the user signs up using Google OAuth
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure unique email addresses
  },
  password: {
    type: String,  // Will be used for email/password signups
  },
  photo: {
    type: String, // Will be populated if the user signs up using Google OAuth
  },
});

// Hash password before saving (only if password exists, for email/password signups)
userSchema.pre('save', async function (next) {
  if (this.password && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare hashed password (used for login with email/password)
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create and export model
const User = mongoose.model('User', userSchema);
module.exports = User;