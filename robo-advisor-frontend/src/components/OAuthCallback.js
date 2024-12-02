// src/components/OAuthCallback.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For programmatic navigation

const OAuthCallback = () => {
  const navigate = useNavigate(); // Hook to navigate programmatically

  useEffect(() => {
    // Get token from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token'); 

    if (token) {
      localStorage.setItem('token', token); // Store token in localStorage
      navigate('/portfolio');  // Redirect to portfolio page after login
    } else {
      console.error('No token found in the URL');
      navigate('/');  // Redirect to home or login page if no token is found
    }
  }, [navigate]);

  return <div>Logging you in...</div>; // Show loading message while processing
};

export default OAuthCallback;
