// Import necessary dependencies
const Portfolio = require('../models/Portfolio'); // Portfolio model to interact with MongoDB
const axios = require('axios'); // Axios library for making HTTP requests

// Function to fetch stock data from Yahoo Finance API
const fetchStockData = async (symbol) => {
  try {
    // Make a GET request to Yahoo Finance API using the provided stock symbol
    const response = await axios.get(`https://yfapi.net/v6/finance/quote?symbols=${symbol}`, {
      headers: { 'x-api-key': process.env.YAHOO_API_KEY }, // Include API key from environment variables
    });
    return response.data; // Return the data from the response
  } catch (error) {
    console.error('Error fetching data from Yahoo Finance:', error); // Log any errors
    throw error; // Rethrow the error to be handled by the caller
  }
};

// Controller method to create a portfolio based on user input
exports.createPortfolio = async (req, res) => {
  // Extract risk tolerance, financial goal, and age from the request body
  const { riskTolerance, financialGoal, age } = req.body;

  // Initialize empty arrays for portfolio allocations and stock data
  let allocations = [];
  let stockData = [];

  // Define a static list of stock symbols for the portfolio (this can be dynamic based on an algorithm)
  const stockSymbols = ['AAPL', 'GOOGL', 'AMZN']; // Example stock symbols for the portfolio

  // Fetch stock data for each symbol in the stockSymbols array
  for (let symbol of stockSymbols) {
    try {
      // Fetch data from Yahoo Finance for the current stock symbol
      const stock = await fetchStockData(symbol);
      // Extract the stock price and store it in the stockData array
      stockData.push({
        symbol,
        price: stock.quoteResponse.result[0].regularMarketPrice, // Extract the regular market price of the stock
      });
    } catch (error) {
      // Log an error message if fetching data for a particular stock fails
      console.error(`Failed to fetch data for ${symbol}`);
    }
  }

  // Determine portfolio allocation based on risk tolerance
  if (riskTolerance === 'high') {
    allocations = [
      { assetType: 'Stocks', percentage: 70, stocks: stockData }, // Allocate 70% to stocks
      { assetType: 'Bonds', percentage: 20 }, // Allocate 20% to bonds
      { assetType: 'Real Estate', percentage: 10 }, // Allocate 10% to real estate
    ];
  } else {
    allocations = [
      { assetType: 'Stocks', percentage: 40, stocks: stockData }, // Allocate 40% to stocks
      { assetType: 'Bonds', percentage: 50 }, // Allocate 50% to bonds
      { assetType: 'Real Estate', percentage: 10 }, // Allocate 10% to real estate
    ];
  }

  // Create a new portfolio document in MongoDB using the Portfolio model
  const portfolio = new Portfolio({
    userId: req.user.id, // The ID of the authenticated user (assumed to be in req.user)
    allocations, // The generated portfolio allocations
  });

  // Save the new portfolio to the database
  await portfolio.save();

  // Respond with a success message, the portfolio, and the stock data
  res.status(201).json({ message: 'Portfolio created', portfolio, stockData });
};