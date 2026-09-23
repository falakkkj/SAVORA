import axios from 'axios';

// Flexibly supports separate backend deployment URL or relative /api proxy
const baseURL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '/api';

const API = axios.create({
  baseURL,
});

// Interceptor to append Bearer token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('savora_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
