// src/components/PortfolioForm.js
import React, { useState } from 'react';
import axios from 'axios';
import PortfolioResults from './PortfolioResults';

function PortfolioForm() {
  const [riskTolerance, setRiskTolerance] = useState('');
  const [financialGoal, setFinancialGoal] = useState('');
  const [age, setAge] = useState('');
  const [portfolio, setPortfolio] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const validateForm = () => {
    if (!riskTolerance || !financialGoal || !age) {
      setError('All fields are required.');
      return false;
    }
    if (age <= 0) {
      setError('Age must be a positive number.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true); // Start loading
    const credentials = { riskTolerance, financialGoal, age };

    try {
      const response = await axios.post('http://localhost:5000/api/generate-portfolio', credentials);
      if (response.status === 200) {
        setPortfolio(response.data.portfolio);
      } else {
        setError('Error generating portfolio. Please try again later.');
      }
    } catch (err) {
      console.error('Error during portfolio generation:', err);
      setError('Error generating portfolio. Please check your network or try again later.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div>
      <h2>Portfolio Preferences</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Risk Tolerance:
          <select
            value={riskTolerance}
            onChange={(e) => setRiskTolerance(e.target.value)}
          >
            <option value="">Select...</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <br />
        <label>
          Financial Goal:
          <select
            value={financialGoal}
            onChange={(e) => setFinancialGoal(e.target.value)}
          >
            <option value="">Select...</option>
            <option value="retirement">Retirement</option>      
            <option value="education">Education</option>
            <option value="home_purchase">Home Purchase</option>
            
          </select>
        </label>
        <br />
        <label>
          Age:
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter your age"
          />
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {portfolio && (
        <div>
          <h3>Generated Portfolio</h3>
          <PortfolioResults portfolio={portfolio} />
        </div>
      )}
    </div>
  );
}

export default PortfolioForm;