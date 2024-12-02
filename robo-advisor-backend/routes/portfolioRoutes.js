// Importing necessary libraries
const express = require('express');  // Express.js for building the web server
const axios = require('axios');  // Axios for making HTTP requests to external APIs
const router = express.Router();  // Create a new Express Router instance

// Function to generate portfolio recommendations based on risk tolerance, age, and financial goal
const getPortfolioRecommendations = (riskTolerance, age, financialGoal) => {
  // Example: Return hardcoded portfolios based on the user's inputs
  let allocations = [];
  if (riskTolerance === 'low') {
    // Conservative portfolio: more bonds, fewer stocks
    allocations = [
      { assetType: 'Bonds', percentage: 70 },
      { assetType: 'Stocks', percentage: 30 },
    ];
  } else if (riskTolerance === 'medium') {
    // Balanced portfolio: equal allocation between bonds and stocks
    allocations = [
      { assetType: 'Bonds', percentage: 50 },
      { assetType: 'Stocks', percentage: 50 },
    ];
  } else {
    // Aggressive portfolio: more stocks, fewer bonds
    allocations = [
      { assetType: 'Bonds', percentage: 20 },
      { assetType: 'Stocks', percentage: 80 },
    ];
  }

  // Example of adding stocks to the portfolio under the 'Stocks' category
  allocations[1].stocks = [
    { symbol: 'AAPL', name: 'Apple' },  // Apple stock
    { symbol: 'MSFT', name: 'Microsoft' },  // Microsoft stock
  ];

  return allocations;  // Return the portfolio allocations
};

// API route to handle portfolio submission and recommendation
router.post('/generate-portfolio', async (req, res) => {
  const { riskTolerance, financialGoal, age } = req.body;  // Extract user inputs from the request body

  // Get the portfolio allocations based on the user's preferences
  const allocations = getPortfolioRecommendations(riskTolerance, age, financialGoal);

  // Fetch stock prices using Yahoo Finance API for the selected stocks
  try {
    // Create an array of promises to fetch the stock prices for each selected stock
    const stockPromises = allocations[1].stocks.map(stock => 
      axios.get(`https://yfapi.net/v6/finance/quote?symbols=${stock.symbol}`, {
        headers: { 'x-api-key': process.env.YAHOO_API_KEY },  // Use the API key for Yahoo Finance API
      })
    );

    // Wait for all stock price requests to complete using Promise.all
    const stockResponses = await Promise.all(stockPromises);

    // Attach the fetched stock prices to the corresponding stocks in the portfolio
    allocations[1].stocks = allocations[1].stocks.map((stock, index) => {
      const stockData = stockResponses[index].data;
      return { 
        ...stock,  // Spread the existing stock data
        price: stockData.quoteResponse.result[0].regularMarketPrice  // Add the stock price to the stock object
      };
    });

    // Send the portfolio with the updated stock prices as a JSON response
    res.status(200).json({ portfolio: allocations });
  } catch (error) {
    // Log any errors that occur while fetching the stock data
    console.error('Error fetching stock data:', error);
    // Send an error response if fetching stock data fails
    res.status(500).json({ message: 'Error fetching stock data.' });
  }
});

module.exports = router;