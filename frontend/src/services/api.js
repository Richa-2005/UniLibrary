//Gateway of all api calls to backend : 
//1. baseURL
//2. token in interceptor

import axios from 'axios';

const api = axios.create({
  
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5500/api', 
});

api.interceptors.request.use(
  (config) => {
   
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;