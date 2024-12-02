// Import the mongoose library for interacting with MongoDB
const mongoose = require('mongoose');

// Define an asynchronous function to connect to the MongoDB database
const connectDB = async () => {
  try {
    // Try to establish a connection to MongoDB using the connection string from environment variables
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true, // Use the new URL parser for MongoDB connection
      useUnifiedTopology: true, // Use the new unified topology engine for better connection management
    });
    // Log a success message if the connection is established
    console.log('MongoDB connected');
  } catch (err) {
    // If an error occurs, log the error message to the console
    console.error(err.message);
    // Exit the process with an error code if the connection fails
    process.exit(1);
  }
};

module.exports = connectDB;
