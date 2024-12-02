const express = require('express');
const axios = require('axios');
const router = express.Router();

// Example of the portfolio allocations based on risk and goal
const getPortfolioRecommendations = (riskTolerance, age, financialGoal) => {
  // Example: Return hardcoded portfolios based on the user's inputs
  let allocations = [];
  if (riskTolerance === 'low') {
    allocations = [
      { assetType: 'Bonds', percentage: 70 },
      { assetType: 'Stocks', percentage: 30 },
    ];
  } else if (riskTolerance === 'medium') {
    allocations = [
      { assetType: 'Bonds', percentage: 50 },
      { assetType: 'Stocks', percentage: 50 },
    ];
  } else {
    allocations = [
      { assetType: 'Bonds', percentage: 20 },
      { assetType: 'Stocks', percentage: 80 },
    ];
  }

  // Example of adding stocks to the portfolio
  allocations[1].stocks = [
    { symbol: 'AAPL', name: 'Apple' },
    { symbol: 'MSFT', name: 'Microsoft' },
  ];

  return allocations;
};

// API route to handle portfolio submission and recommendation
router.post('/generate-portfolio', async (req, res) => {
  const { riskTolerance, financialGoal, age } = req.body;

  // Get the portfolio allocations based on the user's preferences
  const allocations = getPortfolioRecommendations(riskTolerance, age, financialGoal);

  // Fetch stock prices using Yahoo Finance API for the selected stocks
  try {
    const stockPromises = allocations[1].stocks.map(stock => 
      axios.get(`https://yfapi.net/v6/finance/quote?symbols=${stock.symbol}`, {
        headers: { 'x-api-key': process.env.YAHOO_API_KEY },
      })
    );

    const stockResponses = await Promise.all(stockPromises);

    // Attach stock prices to the portfolio
    allocations[1].stocks = allocations[1].stocks.map((stock, index) => {
      const stockData = stockResponses[index].data;
      return { 
        ...stock, 
        price: stockData.quoteResponse.result[0].regularMarketPrice 
      };
    });

    res.status(200).json({ portfolio: allocations });
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ message: 'Error fetching stock data.' });
  }
});

module.exports = router;