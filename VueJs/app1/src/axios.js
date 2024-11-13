import axios from 'axios';

const isLocalhost = window.location.hostname === 'localhost';

// Set the base URL based on whether the app is running on localhost or another network
axios.defaults.baseURL = isLocalhost
  ? 'http://localhost/Sagar/Backend/vue-crud-api/api/v1/'
  : 'http://192.168.0.100/Sagar/Backend/vue-crud-api/api/v1/';

// Optionally configure other defaults like headers or timeouts
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Correct the Authorization header formatting by adding a space after 'Bearer'
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;  // Add a space between 'Bearer' and the token
}

// axios.defaults.timeout = 10000; // Example: Set a timeout of 10 seconds

export default axios;
