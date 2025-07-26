import axios from 'axios';


const apiClient = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}/api`, 
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, 
});

axios.interceptors.request.use(function (config) {
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    return Promise.reject(error);
  });



export default apiClient;