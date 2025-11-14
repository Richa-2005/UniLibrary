// to reduce redundancy in react component of writing base url again and again
// also to attach the token from here before the api call, instead of attaching token 
//at all the components in react
//acts as centre gateway of all api calls to backend
//1. baseURL
//2.token in interceptor : a function which always takes place before any api call

import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:5500/api', 
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