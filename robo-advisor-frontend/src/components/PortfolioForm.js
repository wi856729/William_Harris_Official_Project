// Import React for building the component and useState for managing state
import React, { useState } from 'react';
// Import axios for making HTTP requests
import axios from 'axios';
// Import the PortfolioResults component to display the generated portfolio
import PortfolioResults from './PortfolioResults';

// Define the PortfolioForm component
function PortfolioForm() {
  // State hooks to manage form inputs, errors, loading, and the generated portfolio
  const [riskTolerance, setRiskTolerance] = useState(''); // Risk tolerance input
  const [financialGoal, setFinancialGoal] = useState(''); // Financial goal input
  const [age, setAge] = useState(''); // Age input
  const [portfolio, setPortfolio] = useState(null); // Generated portfolio data
  const [error, setError] = useState(''); // Error message
  const [loading, setLoading] = useState(false); // Loading state

  // Function to validate the form inputs before submission
  const validateForm = () => {
    if (!riskTolerance || !financialGoal || !age) {
      setError('All fields are required.'); // Ensure no field is left empty
      return false;
    }
    if (age <= 0) {
      setError('Age must be a positive number.'); // Validate age input
      return false;
    }
    setError(''); // Clear any previous errors
    return true; // Validation successful
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (!validateForm()) return; // Stop submission if validation fails

    setLoading(true); // Set loading state to true
    const credentials = { riskTolerance, financialGoal, age }; // Prepare form data

    try {
      // Send form data to the backend API to generate the portfolio
      const response = await axios.post('http://localhost:5000/api/generate-portfolio', credentials);
      if (response.status === 200) {
        setPortfolio(response.data.portfolio); // Update state with the generated portfolio
      } else {
        setError('Error generating portfolio. Please try again later.'); // Handle non-200 responses
      }
    } catch (err) {
      console.error('Error during portfolio generation:', err); // Log errors
      setError('Error generating portfolio. Please check your network or try again later.'); // Show error message
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // JSX to render the form and portfolio results
  return (
    <div>
      <h2>Portfolio Preferences</h2>
      {/* Display error message if there is one */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Risk Tolerance:
          {/* Dropdown for selecting risk tolerance */}
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
          {/* Dropdown for selecting financial goal */}
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
          {/* Input field for entering age */}
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter your age"
          />
        </label>
        <br />
        {/* Submit button, disabled while loading */}
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {/* Display the generated portfolio if available */}
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