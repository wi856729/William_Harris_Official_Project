const mongoose = require('mongoose');

// Portfolio recommendations logic based on risk tolerance, age, and financial goal
const getPortfolioRecommendations = (riskTolerance, age, financialGoal) => {
  let allocations = [];

  // Age-based allocations
  if (age <= 34) {
    allocations = [
      { assetType: 'Bonds', percentage: 20 },
      { assetType: 'Stocks', percentage: 80 },
    ];
  } else if (age <= 39) {
    allocations = [
      { assetType: 'Bonds', percentage: 30 },
      { assetType: 'Stocks', percentage: 70 },
    ];
  } else if (age <= 49) {
    allocations = [
      { assetType: 'Bonds', percentage: 50 },
      { assetType: 'Stocks', percentage: 50 },
    ];
  } else if (age <= 59) {
    allocations = [
      { assetType: 'Bonds', percentage: 70 },
      { assetType: 'Stocks', percentage: 30 },
    ];
  } else {
    allocations = [
      { assetType: 'Bonds', percentage: 80 },
      { assetType: 'Stocks', percentage: 20 },
    ];
  }

  // Adjust based on risk tolerance
  if (riskTolerance === 'low') {
    allocations = [
      { assetType: 'Bonds', percentage: allocations[0].percentage + 20 },
      { assetType: 'Stocks', percentage: allocations[1].percentage - 20 },
    ];
  } else if (riskTolerance === 'medium') {
    allocations = [
      { assetType: 'Bonds', percentage: allocations[0].percentage + 10 },
      { assetType: 'Stocks', percentage: allocations[1].percentage - 10 },
    ];
  }

  // Adjust for different financial goals
  if (financialGoal === 'retirement') {
    if (age >= 50) {
      allocations[0].percentage += 10;  // More in bonds
      allocations[1].percentage -= 10;
    }
  } else if (financialGoal === 'education') {
    if (age < 30) {
      allocations[1].percentage += 10;  // More in stocks for education
      allocations[0].percentage -= 10;
    }
  } else if (financialGoal === 'home purchase') {
    if (age <= 39) {
      allocations[1].percentage += 10;  // More aggressive for home purchase
      allocations[0].percentage -= 10;
    } else if (age >= 40) {
      allocations[0].percentage += 20;  // More conservative for short-term
      allocations[1].percentage -= 20;
    }
  }

  // Normalize percentages to always sum to 100%
  const totalPercentage = allocations[0].percentage + allocations[1].percentage;

  // If the sum of percentages is not 100%, adjust them
  if (totalPercentage !== 100) {
    const adjustmentFactor = 100 / totalPercentage;
    allocations[0].percentage = Math.round(allocations[0].percentage * adjustmentFactor);
    allocations[1].percentage = 100 - allocations[0].percentage; // Ensure total is exactly 100%
  }

  // Add stocks to the portfolio
  allocations[1].stocks = [
    { symbol: 'AAPL', name: 'Apple' },
    { symbol: 'MSFT', name: 'Microsoft' },
    { symbol: 'GOOGL', name: 'Alphabet (Google)' },
  ];

  return allocations;
};

const portfolioSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  riskTolerance: {
    type: String, 
    required: true,  // Assuming risk tolerance is required
  },
  financialGoal: {
    type: String, 
    required: true,  // Assuming financial goal is required
  },
  age: {
    type: Number, 
    required: true,  // Assuming age is required
  },
  allocations: [
    {
      assetType: { 
        type: String, 
        required: true,  // Assuming asset type is required
      },
      percentage: { 
        type: Number, 
        required: true,  // Assuming percentage is required
      },
    },
  ],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

// Method to generate portfolio based on user input
portfolioSchema.methods.generatePortfolio = function() {
  const { riskTolerance, age, financialGoal } = this;
  
  // Get the portfolio recommendations based on the user's preferences
  const allocations = getPortfolioRecommendations(riskTolerance, age, financialGoal);

  // Attach the generated allocations to the portfolio document
  this.allocations = allocations;

  return this;
};

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;