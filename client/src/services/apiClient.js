import axios from 'axios';
import {refreshUser} from "./login.js"


const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', 
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