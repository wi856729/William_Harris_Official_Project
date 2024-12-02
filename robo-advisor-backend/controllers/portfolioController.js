const Portfolio = require('../models/Portfolio');
const axios = require('axios');

// Fetch stock data from Yahoo Finance
const fetchStockData = async (symbol) => {
  try {
    const response = await axios.get(`https://yfapi.net/v6/finance/quote?symbols=${symbol}`, {
      headers: { 'x-api-key': process.env.YAHOO_API_KEY },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data from Yahoo Finance:', error);
    throw error;
  }
};

// Create portfolio based on user data and fetch stock prices for allocation
exports.createPortfolio = async (req, res) => {
  const { riskTolerance, financialGoal, age } = req.body;

  // Sample algorithm based on user data
  let allocations = [];
  let stockData = [];

  // Define stocks for portfolio allocation (this can be dynamic based on the algorithm)
  const stockSymbols = ['AAPL', 'GOOGL', 'AMZN']; // Example stock symbols

  // Fetch stock data for each symbol
  for (let symbol of stockSymbols) {
    try {
      const stock = await fetchStockData(symbol);
      stockData.push({
        symbol,
        price: stock.quoteResponse.result[0].regularMarketPrice, // Extract stock price
      });
    } catch (error) {
      console.error(`Failed to fetch data for ${symbol}`);
    }
  }

  if (riskTolerance === 'high') {
    allocations = [
      { assetType: 'Stocks', percentage: 70, stocks: stockData },
      { assetType: 'Bonds', percentage: 20 },
      { assetType: 'Real Estate', percentage: 10 },
    ];
  } else {
    allocations = [
      { assetType: 'Stocks', percentage: 40, stocks: stockData },
      { assetType: 'Bonds', percentage: 50 },
      { assetType: 'Real Estate', percentage: 10 },
    ];
  }

  const portfolio = new Portfolio({
    userId: req.user.id, // assuming a user is authenticated and their ID is in req.user
    allocations,
  });

  await portfolio.save();
  res.status(201).json({ message: 'Portfolio created', portfolio, stockData });
};