import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import GoogleOAuthProvider
import App from './App';
import OAuthCallback from './components/OAuthCallback';
import PortfolioForm from './components/PortfolioForm';
import Login from './components/Login';
import Signup from './components/Signup'; // Import the Signup component

// Get the Google Client ID from .env (REACT_APP_GOOGLE_CLIENT_ID)
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  console.error("Google Client ID is missing. Check your .env file.");
}

const root = ReactDOM.createRoot(document.getElementById('root')); // Render into the DOM
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} /> {/* Main App route */}
          <Route path="/login" element={<Login />} /> {/* Login route */}
          <Route path="/signup" element={<Signup />} /> {/* Signup route */}
          <Route path="/portfolio" element={<PortfolioForm />} /> {/* Portfolio route */}
          <Route path="/oauth/callback" element={<OAuthCallback />} /> {/* OAuth Callback route */}
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);