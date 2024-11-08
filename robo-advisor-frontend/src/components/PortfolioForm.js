// src/components/PortfolioForm.js
import React, { useState } from 'react';

function PortfolioForm({ onSubmit }) {
  const [riskTolerance, setRiskTolerance] = useState('');
  const [financialGoal, setFinancialGoal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ riskTolerance, financialGoal });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Portfolio Preferences</h2>
      <label>
        Risk Tolerance:
        <select value={riskTolerance} onChange={(e) => setRiskTolerance(e.target.value)}>
          <option value="">Select...</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>
      <label>
        Financial Goal:
        <input
          type="text"
          value={financialGoal}
          onChange={(e) => setFinancialGoal(e.target.value)}
          placeholder="e.g., Retirement, Wealth Growth"
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

export default PortfolioForm;