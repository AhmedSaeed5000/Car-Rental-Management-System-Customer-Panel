import React from 'react';
import { Link } from 'react-router-dom';
import { Car as CarType } from '../types';
import { Fuel, Settings } from 'lucide-react';

interface CarCardProps {
  car: CarType;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  return (
    <Link
      to={`/cars/${car._id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative h-48">
        <img
          src={car.images[0] || 'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&q=80'}
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-2 py-1 rounded-md">
          ${car.dailyRate}/day
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {car.make} {car.model}
        </h3>
        <p className="text-sm text-gray-600">{car.year}</p>
        
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center">
            <Settings className="h-4 w-4 mr-1" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center">
            <Fuel className="h-4 w-4 mr-1" />
            <span>{car.category.name}</span>
          </div>
        </div>
        
        <div className="mt-4">
          <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
            View Details
          </button>
        </div>
      </div>
    </Link>
  );
};

export default CarCard;