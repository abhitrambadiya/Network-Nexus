// services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/admin';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor for adding token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, redirect to login
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminInfo');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;