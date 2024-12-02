// Import necessary dependencies
import React, { useState, useEffect } from 'react'; // React for creating components, useState for state management, useEffect for lifecycle methods
import { useNavigate } from 'react-router-dom'; // useNavigate for programmatic navigation between routes
import OAuthLogin from './components/OAuthLogin'; // Import Google OAuth login component
import Signup from './components/Signup'; // Import Signup component

// Define the main App component
function App() {
  // State variables for managing email, password, login status, and signup form visibility
  const [email, setEmail] = useState(''); // State for storing the email input
  const [password, setPassword] = useState(''); // State for storing the password input
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for tracking whether the user is logged in
  const [isSignup, setIsSignup] = useState(false); // State for toggling between login and signup forms
  const navigate = useNavigate(); // Hook for navigating programmatically between routes

  // Handle login with email and password
  const handleLogin = () => {
    // Replace with actual API call for login
    if (email && password) {
      console.log('Login with email:', email, 'and password:', password); // Log credentials (to be replaced with actual logic)
      setIsLoggedIn(true); // Update state to indicate the user is logged in
      localStorage.setItem('token', 'dummy-token'); // Store a dummy token in localStorage (replace with real token after login)
      navigate('/portfolio'); // Redirect to portfolio page after successful login
    } else {
      alert('Please enter both email and password'); // Alert if email or password is missing
    }
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage on logout
    setIsLoggedIn(false); // Update state to reflect that the user is logged out
    navigate('/login'); // Redirect to the login page after logout
  };

  // Check for saved token when the app first loads (persistent login)
  useEffect(() => {
    const savedToken = localStorage.getItem('token'); // Retrieve token from localStorage
    if (savedToken) {
      setIsLoggedIn(true); // If a token is found, mark the user as logged in
    }
  }, []); // Empty dependency array means this effect runs only once when the component is first loaded

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>Welcome to the Robo-Advisor</h1>

      {/* Conditional rendering based on login state */}
      {isLoggedIn ? (
        // If logged in, show a welcome message and a logout button
        <div>
          <p>You are logged in!</p>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      ) : (
        // If not logged in, show the login/signup form
        <div>
          {isSignup ? (
            // If signup form is being shown, render Signup component
            <Signup onSignup={handleLogin} setIsSignup={setIsSignup} />
          ) : (
            <>
              {/* Login form */}
              <h2>Login</h2>
              <div>
                <label>
                  Email:
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // Update email state on input change
                    placeholder="Enter your email"
                  />
                </label>
              </div>
              <div>
                <label>
                  Password:
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // Update password state on input change
                    placeholder="Enter your password"
                  />
                </label>
              </div>
              <div>
                <button onClick={handleLogin}>Log In</button> {/* Call handleLogin function on click */}
              </div>

              {/* Google OAuth login */}
              <div>
                <h3>Or sign in with Google:</h3>
                <OAuthLogin onOAuthLogin={handleLogin} /> {/* Render Google OAuth login button */}
              </div>

              {/* Link to toggle signup form */}
              <div>
                <p>
                  Don't have an account?{' '}
                  <button
                    onClick={() => setIsSignup(true)}  // Set isSignup to true to show Signup form
                    style={{ background: 'none', border: 'none', color: '#007BFF', cursor: 'pointer' }}
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;