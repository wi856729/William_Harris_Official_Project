// Import React to define the component
import React from 'react';

// Define the PortfolioResults component, which receives a `portfolio` prop
function PortfolioResults({ portfolio }) {
  // If the portfolio is null or undefined, display a message to the user
  if (!portfolio) {
    return <div>Please submit your preferences to see recommendations.</div>;
  }

  // Render the portfolio results
  return (
    <div>
      <h2>Recommended Portfolio</h2>
      <ul>
        {/* Loop through the portfolio array to display each asset type */}
        {portfolio.map((item, index) => (
          <li key={index}>
            {/* Display the asset type and its percentage allocation */}
            {item.assetType}: {item.percentage}%
            {/* If the asset type includes stocks, render them as a nested list */}
            {item.stocks && (
              <ul>
                {item.stocks.map((stock, idx) => (
                  <li key={idx}>
                    {/* Display the stock name, symbol, and price */}
                    {stock.name} ({stock.symbol}): ${stock.price.toFixed(2)}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PortfolioResults;