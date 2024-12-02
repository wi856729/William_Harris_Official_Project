// src/components/OAuthCallback.js

import React, { useEffect } from 'react'; // Import React and the useEffect hook
import { useNavigate } from 'react-router-dom'; // Import useNavigate for programmatic navigation

// Define the OAuthCallback component
const OAuthCallback = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate between routes

  useEffect(() => {
    // Extract the token from the URL's query parameters
    const urlParams = new URLSearchParams(window.location.search); // Access the query string of the current URL
    const token = urlParams.get('token'); // Get the value of the "token" parameter

    if (token) {
      // If a token exists, store it in localStorage for future authentication
      localStorage.setItem('token', token); 
      navigate('/portfolio'); // Redirect the user to the portfolio page
    } else {
      // If no token is found, log an error to the console and redirect to the home page
      console.error('No token found in the URL'); 
      navigate('/'); // Redirect to the home or login page
    }
  }, [navigate]); // Dependency array includes navigate to ensure proper cleanup and behavior

  return <div>Logging you in...</div>; // Render a loading message while the login process is handled
};

export default OAuthCallback;