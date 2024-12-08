export interface Car {
  _id: string;
  make: string;
  model: string;
  year: number;
  category: Category;
  branch: Branch;
  licensePlate: string;
  dailyRate: number;
  status: 'available' | 'rented' | 'maintenance';
  features: string[];
  images: string[];
  mileage: number;
  transmission: string;
}

export interface Category {
  _id: string;
  name: string;
}

export interface Branch {
  _id: string;
  name: string;
  location: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}