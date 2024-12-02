import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

function OAuthLogin({ onOAuthLogin }) {
  const handleSuccess = async (credentialResponse) => {
    if (credentialResponse.credential) {
      const token = credentialResponse.credential;
      const decoded = jwtDecode(token);

      try {
        // Send the token to your backend for validation and further processing
        const response = await axios.post('http://localhost:5000/auth/google', { token });

        if (response.status === 200) {
          // Pass the token received from backend to the parent component (App)
          onOAuthLogin(response.data.token);
        } else {
          console.error('Google OAuth login failed:', response.data.message);
        }
      } catch (err) {
        console.error('Error during Google OAuth login:', err);
      }
    }
  };

  const handleError = () => {
    console.error('Google Login Failed');
  };

  return (
    <div>
      {/* Google Login button */}
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
}

export default OAuthLogin;