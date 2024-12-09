export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  token?: string;
}

export interface Car {
  _id: string;
  make: string;
  model: string;
  year: number;
  dailyRate: number;
  status: 'available' | 'rented' | 'maintenance';
  images: string[];
  category: {
    _id: string;
    name: string;
  };
  transmission: string;
  features: string[];
}

export interface Booking {
  _id: string;
  car: Car;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: string;
  paymentMethod: 'cash payment' | 'stripe';
}

export interface Branch {
  _id: string;
  name: string;
  address: string;
  city: string;
  contactNumber: string;
  email: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}