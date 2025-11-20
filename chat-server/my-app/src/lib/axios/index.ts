import axios from 'axios';
import { toast } from 'react-toastify';

// Create an instance of axios with some default configuration
const AxiosInstance = axios.create({
  baseURL: 'http://localhost',
  headers: {
    'Content-Type': 'application/json'
  }
});

AxiosInstance.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response.data;
  },
  (error) => {
    // Handle errors
    console.log('Axios error:', error);

    toast.error(error.response?.data?.message || 'An error occurred');
    return Promise.reject(error);
  }
);

AxiosInstance.interceptors.request.use(
  (config) => {
    // Add any request interceptors here, e.g., adding auth tokens
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);
export default AxiosInstance;
