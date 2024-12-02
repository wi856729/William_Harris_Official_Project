import React, { useState } from 'react';
import axios from 'axios';

function Signup({ onSignup, setIsSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const credentials = {
      displayName,
      email,
      password,
    };

    try {
      const response = await axios.post('http://localhost:5000/auth/signup', credentials);

      if (response.status === 200) {
        const { token } = response.data;
        localStorage.setItem('token', token);
        setIsSignup(false);  // Set isSignup to false to navigate back to the login form
        onSignup(token);  // Call onSignup (could be for setting the token or any other logic)
      }
    } catch (err) {
      console.error('Error during signup:', err);
      if (err.response && err.response.data.errors) {
        setError(err.response.data.errors.map((e) => e.msg).join(', ')); // Show the validation errors
      } else {
        setError('Error signing up');
      }
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <span onClick={() => setIsSignup(false)}>Login</span>
      </p>
    </div>
  );
}

export default Signup;