// src/api.js
import axios from 'axios';

// Get base URL from environment variables for flexibility
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'; // Fallback to localhost if not set in .env

// Base configuration for Axios
const api = axios.create({
  baseURL: BASE_URL, // Use environment variable for base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Optionally log errors or show notifications
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiry or authentication errors
api.interceptors.response.use(
  (response) => response, // If no error, just return the response
  (error) => {
    // Check for authentication-related errors (e.g., token expired)
    if (error.response && error.response.status === 401) {
      // Handle token expiration or authentication error
      console.error('Authentication error:', error);
      // Optionally redirect to login
      window.location.href = '/login'; // Or use navigate if you're using React Router
    }
    return Promise.reject(error);
  }
);

export default api;