import axios from 'axios';

const getDefaultApiBaseUrl = () => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  if (isLocalhost) {
    return 'http://localhost:5000/api';
  }

  return '/api';
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || getDefaultApiBaseUrl(),
  withCredentials: true,
});

export default api;
