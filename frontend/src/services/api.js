import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get or create device ID
export const getDeviceId = () => {
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = uuidv4();
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
};

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Add token and device ID
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const deviceId = getDeviceId();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    config.headers['x-device-id'] = deviceId;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', { ...data, deviceId: getDeviceId() }),
  login: (data) => api.post('/auth/login', { ...data, deviceId: getDeviceId() }),
  getProfile: () => api.get('/auth/profile'),
  logout: () => api.post('/auth/logout')
};

// Savings APIs
export const savingsAPI = {
  deposit: (data) => api.post('/savings/deposit', data),
  withdraw: (data) => api.post('/savings/withdraw', data),
  getBalance: () => api.get('/savings/balance'),
  getTransactions: (page = 1, limit = 20) => 
    api.get(`/savings/transactions?page=${page}&limit=${limit}`)
};

export default api;