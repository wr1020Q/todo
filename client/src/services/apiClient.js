import axios from 'axios';


const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', 
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, 
});

apiClient.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

  apiClient.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    return Promise.reject(error);
  });

export default apiClient;