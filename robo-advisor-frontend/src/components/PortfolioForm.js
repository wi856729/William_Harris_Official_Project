// src/components/PortfolioForm.js
import React, { useState } from 'react';

function PortfolioForm({ onSubmit }) {
  const [riskTolerance, setRiskTolerance] = useState('');
  const [financialGoal, setFinancialGoal] = useState('');
  const [age, setAge] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ riskTolerance, financialGoal, age });
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
        <select value={financialGoal} onChange={(e) => setFinancialGoal(e.target.value)}>
          <option value="">Select...</option>
          <option value="retirement">Retirement</option>
          <option value="wealth_growth">Wealth Growth</option>
          <option value="education">Education</option>
          <option value="home_purchase">Home Purchase</option>
          <option value="emergency_fund">Emergency Fund</option>
        </select>
      </label>
      
      <label>
        Age:
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Enter your age"
        />
      </label>
      
      <button type="submit">Submit</button>
    </form>
  );
}

export default PortfolioForm;