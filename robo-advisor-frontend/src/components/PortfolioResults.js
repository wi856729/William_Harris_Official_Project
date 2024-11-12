// src/components/PortfolioResults.js
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
            {item.name}: {item.allocation}%
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PortfolioResults;