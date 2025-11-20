import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 1000
});

axios.interceptors.response.use(
  (response) => {
    console.log('Response received: ', response);
    return response;
  },
  (error) => {
    console.error('Response error: ', error);
    if (error.code) {
      console.error('Error code: ', error.code);
    }
    return Promise.reject(error);
  }
);
export default {
  get: axiosInstance.get,
  post: axiosInstance.post,
  put: axiosInstance.put,
  delete: axiosInstance.delete
};
