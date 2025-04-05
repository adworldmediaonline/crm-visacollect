import axios from 'axios';

// const BASE_URL = 'https://visa-backend-v2.vercel.app/api/v1/';
const BASE_URL = 'http://localhost:8090/api/v1/';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.clear();
      delete apiClient.defaults.headers.common.Authorization;
    }
    return Promise.reject(error);
  }
);

export default apiClient;
