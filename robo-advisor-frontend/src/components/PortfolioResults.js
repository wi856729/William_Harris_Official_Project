import React from 'react';

function PortfolioResults({ portfolio }) {
  if (!portfolio) {
    return <div>Please submit your preferences to see recommendations.</div>;
  }

  return (
    <div>
      <h2>Recommended Portfolio</h2>
      <ul>
        {portfolio.map((item, index) => (
          <li key={index}>
            {item.assetType}: {item.percentage}% 
            {item.stocks && (
              <ul>
                {item.stocks.map((stock, idx) => (
                  <li key={idx}>
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