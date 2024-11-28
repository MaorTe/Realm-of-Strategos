import axios from 'axios';

export const httpClient = axios.create({
  baseURL: 'http://localhost:4000',  // Base URL
  timeout: 5000,  // Default timeout
  headers: { 'Content-Type': 'application/json' },
});

// Use the `httpClient` in both services instead of directly importing Axios.