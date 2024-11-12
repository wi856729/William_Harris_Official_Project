// src/App.js
import React, { useState } from 'react';
import PortfolioForm from './components/PortfolioForm';
import PortfolioResults from './components/PortfolioResults';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const [portfolio, setPortfolio] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // To handle login state

  const handleFormSubmit = async (preferences) => {
    // Destructure the preferences object to access riskTolerance, financialGoal, and age
    const { riskTolerance, financialGoal, age } = preferences;
    
    // Simulate fetching portfolio recommendations based on the preferences
    console.log('Submitted preferences:', { riskTolerance, financialGoal, age });

    // Dummy data for portfolio recommendations (this should be replaced by your API call)
    const dummyPortfolio = [
      { name: 'Stocks', allocation: 60 },
      { name: 'Bonds', allocation: 30 },
      { name: 'Real Estate', allocation: 10 },
    ];

    setPortfolio(dummyPortfolio); // This is where portfolio data is set
  };

  const handleLogin = (credentials) => {
    console.log('Logging in with:', credentials);
    setIsLoggedIn(true); // Set the logged-in state to true
  };

  const handleSignup = (credentials) => {
    console.log('Signing up with:', credentials);
    setIsLoggedIn(true); // Optionally set logged-in state after signup
  };

  return (
    <div>
      <h1>Robo-Advisor</h1>
      {isLoggedIn ? (
        <>
          <PortfolioForm onSubmit={handleFormSubmit} />
          <PortfolioResults portfolio={portfolio} />
        </>
      ) : (
        <>
          <Login onLogin={handleLogin} />
          <Signup onSignup={handleSignup} />
        </>
      )}
    </div>
  );
}

export default App;