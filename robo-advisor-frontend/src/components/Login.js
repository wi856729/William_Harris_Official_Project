import React, { useState } from 'react'; // Import React and the useState hook for managing component state
import { useNavigate } from 'react-router-dom'; // Import useNavigate for programmatic navigation
import OAuthLogin from './OAuthLogin'; // Import the OAuthLogin component for third-party login functionality

// Define the Login component
function Login() {
  // State variables to manage user input for email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate(); // Create a navigate function for route redirection

  // Function to handle the login process
  const handleLogin = async () => {
    try {
      // Send a POST request to the backend with user credentials
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST', // HTTP method
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ email, password }), // Convert email and password to JSON
      });

      // If the login is successful
      if (response.ok) {
        const data = await response.json(); // Parse the JSON response
        localStorage.setItem('token', data.token); // Save the authentication token to local storage
        navigate('/portfolio'); // Redirect the user to the portfolio page
      } else {
        const errorData = await response.json(); // Parse the error response
        alert(errorData.message || 'Login failed'); // Display an error message
      }
    } catch (error) {
      console.error('Login error:', error); // Log any errors for debugging
      alert('An error occurred. Please try again.'); // Show a generic error message
    }
  };

  // Function to handle OAuth login success
  const handleOAuthLogin = (token) => {
    localStorage.setItem('token', token); // Save the OAuth authentication token to local storage
    navigate('/portfolio'); // Redirect the user to the portfolio page
  };

  // Render the login form
  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <h1>Welcome to the Robo-Advisor</h1> {/* Main heading */}
      <h2>Login</h2> {/* Subheading */}
      <div>
        <label>
          Email:
          <input
            type="email" // Input type ensures email format
            value={email} // Controlled input bound to state
            onChange={(e) => setEmail(e.target.value)} // Update state on user input
            placeholder="Enter your email" // Placeholder text
          />
        </label>
      </div>
      <div>
        <label>
          Password:
          <input
            type="password" // Input type masks the password
            value={password} // Controlled input bound to state
            onChange={(e) => setPassword(e.target.value)} // Update state on user input
            placeholder="Enter your password" // Placeholder text
          />
        </label>
      </div>
      <div>
        <button onClick={handleLogin} style={{ marginTop: '10px' }}>Log In</button> {/* Button triggers login */}
      </div>
      <div>
        <p>Or log in with:</p>
        {/* Include the OAuthLogin component for third-party authentication */}
        <OAuthLogin onOAuthLogin={handleOAuthLogin} />
      </div>
      <div>
        <p>
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/signup')} // Navigate to the signup page
            style={{
              background: 'none', // No background styling for button
              border: 'none', // No border styling
              color: '#007BFF', // Button color
              cursor: 'pointer', // Pointer cursor for interactivity
              textDecoration: 'underline', // Underline styling for text
            }}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;