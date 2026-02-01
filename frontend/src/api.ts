import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Relative path to use proxy
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
