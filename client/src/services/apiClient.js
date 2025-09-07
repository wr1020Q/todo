import axios from 'axios';

const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_BASE_URL
    : "http://localhost:3000/api";
    console.log("baseURL",baseURL)
    

const apiClient = axios.create({
  baseURL: baseURL, 
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, 
});
console.log(apiClient.defaults.baseURL);

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