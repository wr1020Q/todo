import axios from 'axios';
import { notifyErrorMessage } from '../utils/errorNotifier';
import { showError } from '../utils/toast';


const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',  
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, 
});

apiClient.interceptors.request.use(function (config) {
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

  apiClient.interceptors.response.use(function (response) {

    return response;
  }, function (error) {
      const msg = error.response?.data?.message || '通信エラーが発生しました';
      // showError(msg)
      // notifyErrorMessage(msg);
    return Promise.reject(error);
  });

export default apiClient;