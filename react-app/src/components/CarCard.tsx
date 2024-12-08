import React from 'react';
import { Car } from '../types';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Car as CarIcon, Calendar, MapPin, Gauge } from 'lucide-react';

interface CarCardProps {
  car: Car;
}

export const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const handleBookClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      // Booking functionality will be implemented later
      console.log('Book car:', car._id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={car.images[0] || 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80'}
        alt={`${car.make} ${car.model}`}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{`${car.make} ${car.model}`}</h3>
          <span className="text-lg font-bold text-blue-600">${car.dailyRate}/day</span>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <CarIcon className="w-4 h-4 mr-2" />
            <span>{car.category.name}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{car.year}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{car.branch.location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Gauge className="w-4 h-4 mr-2" />
            <span>{car.mileage.toLocaleString()} km</span>
          </div>
        </div>

        <button
          onClick={handleBookClick}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          {isAuthenticated ? 'Book Now' : 'Login to Book'}
        </button>
      </div>
    </div>
  );
};