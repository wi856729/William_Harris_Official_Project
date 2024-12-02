// Import the Mongoose library to interact with MongoDB
const mongoose = require('mongoose');

// Function to generate portfolio recommendations based on risk tolerance, age, and financial goal
const getPortfolioRecommendations = (riskTolerance, age, financialGoal) => {
  let allocations = []; // Initialize an empty array for portfolio allocations

  // Define portfolio allocations based on age ranges
  if (age <= 34) {
    allocations = [
      { assetType: 'Bonds', percentage: 20 }, // 20% Bonds
      { assetType: 'Stocks', percentage: 80 }, // 80% Stocks
    ];
  } else if (age <= 39) {
    allocations = [
      { assetType: 'Bonds', percentage: 30 }, // 30% Bonds
      { assetType: 'Stocks', percentage: 70 }, // 70% Stocks
    ];
  } else if (age <= 49) {
    allocations = [
      { assetType: 'Bonds', percentage: 50 }, // 50% Bonds
      { assetType: 'Stocks', percentage: 50 }, // 50% Stocks
    ];
  } else if (age <= 59) {
    allocations = [
      { assetType: 'Bonds', percentage: 70 }, // 70% Bonds
      { assetType: 'Stocks', percentage: 30 }, // 30% Stocks
    ];
  } else {
    allocations = [
      { assetType: 'Bonds', percentage: 80 }, // 80% Bonds
      { assetType: 'Stocks', percentage: 20 }, // 20% Stocks
    ];
  }

  // Adjust portfolio allocations based on risk tolerance
  if (riskTolerance === 'low') {
    allocations = [
      { assetType: 'Bonds', percentage: allocations[0].percentage + 20 }, // Increase Bonds by 20%
      { assetType: 'Stocks', percentage: allocations[1].percentage - 20 }, // Decrease Stocks by 20%
    ];
  } else if (riskTolerance === 'medium') {
    allocations = [
      { assetType: 'Bonds', percentage: allocations[0].percentage + 10 }, // Increase Bonds by 10%
      { assetType: 'Stocks', percentage: allocations[1].percentage - 10 }, // Decrease Stocks by 10%
    ];
  }

  // Adjust portfolio allocations based on the user's financial goal
  if (financialGoal === 'retirement') {
    if (age >= 50) {
      allocations[0].percentage += 10;  // More in bonds for retirement
      allocations[1].percentage -= 10; // Less in stocks for retirement
    }
  } else if (financialGoal === 'education') {
    if (age < 30) {
      allocations[1].percentage += 10;  // More in stocks for education
      allocations[0].percentage -= 10; // Less in bonds for education
    }
  } else if (financialGoal === 'home purchase') {
    if (age <= 39) {
      allocations[1].percentage += 10;  // More in stocks for home purchase (more aggressive)
      allocations[0].percentage -= 10; // Less in bonds for home purchase
    } else if (age >= 40) {
      allocations[0].percentage += 20;  // More in bonds for home purchase (more conservative)
      allocations[1].percentage -= 20; // Less in stocks for home purchase
    }
  }

  // Normalize percentages to always sum to 100%
  const totalPercentage = allocations[0].percentage + allocations[1].percentage;

  // If the sum of percentages is not 100%, adjust them
  if (totalPercentage !== 100) {
    const adjustmentFactor = 100 / totalPercentage; // Calculate the factor for adjusting percentages
    allocations[0].percentage = Math.round(allocations[0].percentage * adjustmentFactor); // Adjust Bond percentage
    allocations[1].percentage = 100 - allocations[0].percentage; // Adjust Stock percentage to ensure total is 100%
  }

  // Add stock details to the allocations (example stock symbols)
  allocations[1].stocks = [
    { symbol: 'AAPL', name: 'Apple' }, // Add Apple stock
    { symbol: 'MSFT', name: 'Microsoft' }, // Add Microsoft stock
    { symbol: 'GOOGL', name: 'Alphabet (Google)' }, // Add Google stock
  ];

  return allocations; // Return the final portfolio allocations
};

// Define a Mongoose schema for the Portfolio model
const portfolioSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,  // Reference to the User model for the user ID
    ref: 'User', // Reference the User collection in MongoDB
  },
  riskTolerance: {
    type: String, // Store risk tolerance as a string
    required: true,  // Risk tolerance is required
  },
  financialGoal: {
    type: String, // Store financial goal as a string
    required: true,  // Financial goal is required
  },
  age: {
    type: Number, // Store age as a number
    required: true,  // Age is required
  },
  allocations: [  // Store the portfolio allocations as an array of objects
    {
      assetType: { 
        type: String,  // Asset type (e.g., Bonds, Stocks)
        required: true,  // Asset type is required
      },
      percentage: { 
        type: Number,  // Percentage allocation for the asset type
        required: true,  // Percentage is required
      },
    },
  ],
  createdAt: { 
    type: Date, 
    default: Date.now  // Set default to current date if not provided
  },
});

// Add a method to the Portfolio schema to generate portfolio based on the user's data
portfolioSchema.methods.generatePortfolio = function() {
  const { riskTolerance, age, financialGoal } = this;  // Destructure user data from the portfolio document
  
  // Get the portfolio recommendations using the previously defined function
  const allocations = getPortfolioRecommendations(riskTolerance, age, financialGoal);

  // Attach the generated allocations to the portfolio document
  this.allocations = allocations;

  return this;  // Return the updated portfolio document
};

// Create the Portfolio model from the schema
const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;