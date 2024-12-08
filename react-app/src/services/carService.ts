import axios from 'axios';
import { Car } from '../types';

const API_URL = 'http://localhost:3002';

export const carService = {
  getAllCars: async (params?: {
    location?: string;
    category?: string;
    availability?: string;
    minPrice?: number;
    maxPrice?: number;
    make?: string;
    model?: string;
  }) => {
    const response = await axios.get(`${API_URL}/cars`, { params });
    return response.data.data;
  },

  getAvailableCars: async () => {
    const response = await axios.get(`${API_URL}/cars/status/available`);
    return response.data.data;
  },

  getCarById: async (id: string) => {
    const response = await axios.get(`${API_URL}/cars/${id}`);
    return response.data.data;
  },
};