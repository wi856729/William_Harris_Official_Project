// Import necessary dependencies
import React, { useState } from 'react'; // React for creating components, useState for managing state
import axios from 'axios'; // Axios for making HTTP requests

// Define the Signup component
function Signup({ onSignup, setIsSignup }) {
  // State variables to manage form inputs and error messages
  const [email, setEmail] = useState(''); // For storing email input
  const [password, setPassword] = useState(''); // For storing password input
  const [displayName, setDisplayName] = useState(''); // For storing display name input
  const [error, setError] = useState(''); // For displaying error messages

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Collect user inputs into an object
    const credentials = {
      displayName,
      email,
      password,
    };

    try {
      // Send a POST request to the backend for user signup
      const response = await axios.post('http://localhost:5000/auth/signup', credentials);

      if (response.status === 200) {
        // On successful signup, extract the token from the response
        const { token } = response.data;

        // Save the token in local storage for authentication purposes
        localStorage.setItem('token', token);

        // Switch to the login form by setting `isSignup` to false
        setIsSignup(false);

        // Invoke the `onSignup` function passed as a prop (e.g., to set the token in a parent component)
        onSignup(token);
      }
    } catch (err) {
      console.error('Error during signup:', err); // Log errors for debugging

      // Handle validation errors returned by the backend
      if (err.response && err.response.data.errors) {
        setError(err.response.data.errors.map((e) => e.msg).join(', ')); // Combine error messages into a single string
      } else {
        setError('Error signing up'); // Generic error message for unexpected errors
      }
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {/* Display error messages in red if there are any */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* Input field for display name */}
        <input
          type="text"
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)} // Update state on input change
        />
        {/* Input field for email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update state on input change
        />
        {/* Input field for password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update state on input change
        />
        {/* Submit button */}
        <button type="submit">Sign Up</button>
      </form>
      {/* Link to switch back to the login form */}
      <p>
        Already have an account? <span onClick={() => setIsSignup(false)}>Login</span>
      </p>
    </div>
  );
}

export default Signup;