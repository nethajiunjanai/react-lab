import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30_000,
});

api.interceptors.request.use((config) => {
  // Add authentication token here later if required.
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Centralized API error handling can go here.
    return Promise.reject(error);
  },
);