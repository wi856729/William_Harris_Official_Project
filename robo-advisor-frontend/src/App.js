import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OAuthLogin from './components/OAuthLogin'; // Import Google OAuth login component
import Signup from './components/Signup'; // Import Signup component

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignup, setIsSignup] = useState(false);  // Manage signup state
  const navigate = useNavigate();

  // Handle email/password login
  const handleLogin = () => {
    // Replace with actual API call for login
    if (email && password) {
      console.log('Login with email:', email, 'and password:', password);
      setIsLoggedIn(true);
      localStorage.setItem('token', 'dummy-token'); // Save a dummy token in localStorage
      navigate('/portfolio'); // Redirect to portfolio after successful login
    } else {
      alert('Please enter both email and password');
    }
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login'); // Redirect to login page after logout
  };

  // Check for saved token when the app first loads
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>Welcome to the Robo-Advisor</h1>

      {isLoggedIn ? (
        <div>
          <p>You are logged in!</p>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      ) : (
        <div>
          {isSignup ? (
            <Signup onSignup={handleLogin} setIsSignup={setIsSignup} />
          ) : (
            <>
              <h2>Login</h2>
              <div>
                <label>
                  Email:
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                </label>
              </div>
              <div>
                <button onClick={handleLogin}>Log In</button>
              </div>
              <div>
                <h3>Or sign in with Google:</h3>
                <OAuthLogin onOAuthLogin={handleLogin} />
              </div>
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