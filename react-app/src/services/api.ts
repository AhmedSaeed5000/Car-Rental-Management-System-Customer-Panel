import axios from 'axios';
const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  register: (userData: any) => 
    api.post('/auth/register', userData),
  googleLogin: (token: string) => 
    api.post('/auth/google-login', { token }),
};

export const cars = {
  getAvailable: () => 
    api.get('/cars/status/available'),
  getById: (id: string) => 
    api.get(`/cars/${id}`),
  search: (params: any) => 
    api.get('/cars', { params }),
};

export const bookings = {
  create: (bookingData: any) => 
    api.post('/booking', bookingData),
  getCustomerBookings: (customerId: string) => 
    api.get(`/booking/${customerId}`),
  cancel: (bookingId: string) => 
    api.delete(`/booking/${bookingId}`),
};

export const payments = {
  create: (paymentData: any) => 
    api.post('/payments', paymentData),
  updateStatus: (paymentId: string, status: string) => 
    api.put(`/payments/${paymentId}`, { status }),
};

export const branches = {
  getAll: () => api.get('/branch'),
  getById: (id: string) => api.get(`/branch/${id}`),
};

export default api;