// here Axios instance or fetch wrapper
// src/lib/api.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // 5555
  withCredentials: true, // For sending cookies (including HTTP-only JWT)
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;