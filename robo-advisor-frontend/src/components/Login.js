import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OAuthLogin from './OAuthLogin'; // Import the OAuthLogin component

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Save token to local storage
        navigate('/portfolio'); // Redirect to the portfolio page
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleOAuthLogin = (token) => {
    localStorage.setItem('token', token); // Save OAuth token to local storage
    navigate('/portfolio'); // Redirect to the portfolio page
  };

  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <h1>Welcome to the Robo-Advisor</h1>
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
        <button onClick={handleLogin} style={{ marginTop: '10px' }}>Log In</button>
      </div>
      <div>
        <p>Or log in with:</p>
        {/* Include the OAuthLogin component */}
        <OAuthLogin onOAuthLogin={handleOAuthLogin} />
      </div>
      <div>
        <p>
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/signup')}
            style={{
              background: 'none',
              border: 'none',
              color: '#007BFF',
              cursor: 'pointer',
              textDecoration: 'underline',
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