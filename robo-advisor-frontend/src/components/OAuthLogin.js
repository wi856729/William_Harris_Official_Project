import React from 'react'; // Import React to use its component system
import { GoogleLogin } from '@react-oauth/google'; // Import GoogleLogin component for Google OAuth
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode to decode the JWT token
import axios from 'axios'; // Import axios for making HTTP requests

// Define the OAuthLogin component, which accepts a callback function `onOAuthLogin` as a prop
function OAuthLogin({ onOAuthLogin }) {

  // Function to handle successful Google login
  const handleSuccess = async (credentialResponse) => {
    // Check if the response contains a credential (Google-provided JWT token)
    if (credentialResponse.credential) {
      const token = credentialResponse.credential; // Extract the token from the response
      const decoded = jwtDecode(token); // Decode the token to extract user information (e.g., email, name)

      try {
        // Send the token to the backend for validation and to obtain a server-side token
        const response = await axios.post('http://localhost:5000/auth/google', { token });

        if (response.status === 200) {
          // If the backend returns a successful response, call the `onOAuthLogin` callback with the server token
          onOAuthLogin(response.data.token);
        } else {
          // Log an error if the backend responds with an unsuccessful status code
          console.error('Google OAuth login failed:', response.data.message);
        }
      } catch (err) {
        // Handle any errors that occur during the HTTP request
        console.error('Error during Google OAuth login:', err);
      }
    }
  };

  // Function to handle errors during Google login
  const handleError = () => {
    console.error('Google Login Failed'); // Log an error message if login fails
  };

  return (
    <div>
      {/* Render the Google Login button */}
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
}

export default OAuthLogin;