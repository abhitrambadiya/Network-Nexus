// services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/alumni';

// Create axios instance with base URL
const apiAlumni = axios.create({
  baseURL: API_URL,
});

// Request interceptor for adding token
apiAlumni.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('alumniToken');
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
apiAlumni.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, redirect to login
      localStorage.removeItem('alumniToken');
      localStorage.removeItem('alumniInfo');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default apiAlumni;