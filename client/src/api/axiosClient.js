import axios from 'axios';

// Resolve base API URL from environment, fallback to localhost
let envUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Normalize URL: remove any trailing slashes
envUrl = envUrl.trim().replace(/\/+$/, '');

// Ensure /api suffix is present for consistency
if (!envUrl.endsWith('/api')) {
  envUrl = `${envUrl}/api`;
}

const axiosClient = axios.create({
  baseURL: envUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT bearer token from localStorage
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('medipulse_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Catch 401 Unauthenticated errors, clear session, and redirect
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and cached user
      localStorage.removeItem('medipulse_token');
      localStorage.removeItem('medipulse_user');

      // Only redirect if not already on the login or register page
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
