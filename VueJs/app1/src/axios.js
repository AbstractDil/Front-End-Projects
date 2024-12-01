/*
import axios from 'axios';

const isLocalhost = window.location.hostname === 'localhost';

// Set the base URL based on whether the app is running on localhost or another network
axios.defaults.baseURL = isLocalhost
  ? 'http://localhost/Sagar/Backend/vue-crud-api/api/v1/'
  : 'http://192.168.0.101/Sagar/Backend/vue-crud-api/api/v1/';

// Optionally configure other defaults like headers or timeouts
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Correct the Authorization header formatting by adding a space after 'Bearer'
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;  // Add a space between 'Bearer' and the token
}

// axios.defaults.timeout = 10000; // Example: Set a timeout of 10 seconds

export default axios;
*/

import axios from 'axios';

// Load base URL from environment variables
axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;

// Optionally configure other defaults like headers or timeouts
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add a request interceptor to automatically include the Authorization header
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add Authorization header dynamically
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Handle errors in the request configuration
  }
);

// Optionally handle responses globally
axios.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    // Handle errors globally (optional)
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized! Redirecting to login...');
      // Example: Redirect to login page if unauthorized
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axios;
