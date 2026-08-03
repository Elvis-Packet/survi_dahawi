import axios from 'axios';

// TODO:
// Connect Flask Backend — set VITE_API_BASE_URL in .env to your Flask server
// e.g. VITE_API_BASE_URL=http://localhost:5000
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('survitec_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Normalize errors and handle 401 globally
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalid — clear and let auth guard redirect
      localStorage.removeItem('survitec_token');
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
