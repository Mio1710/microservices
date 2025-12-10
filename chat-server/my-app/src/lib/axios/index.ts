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
    if (error.response?.status === 401) {
      if (error.response?.data?.code === 'TOKEN_EXPIRED') {
        console.log('Session expired. Get new token.');
        // call to refresh token endpoint could be placed here
        // return Promise.reject(error);
      }
      if (error.response?.data?.code === 'UNAUTHORIZED') {
        toast.error('You can not access this resource');
        return Promise.reject(error);
      }
      toast.error('Authentication error. Please log in again.');
      // Optionally, redirect to login page
      // window.location.href = '/login';
      return Promise.reject(error);
    }

    toast.error(error.response?.data?.message || 'An error occurred');
    return Promise.reject(error);
  }
);

AxiosInstance.interceptors.request.use(
  (config) => {
    // Add token
    const token = localStorage.getItem('access_token');
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
