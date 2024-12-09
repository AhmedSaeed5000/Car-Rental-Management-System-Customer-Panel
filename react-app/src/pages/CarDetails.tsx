import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Settings, Fuel, Check, AlertCircle } from 'lucide-react';
import { cars } from '../services/api';
import { Car } from '../types';
import { useAuth } from '../context/AuthContext';
import BookingModal from '../components/BookingModal';
import toast from 'react-hot-toast';

const CarDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCarDetails();
  }, [id]);

  const fetchCarDetails = async () => {
    try {
      const response = await cars.getById(id!);
      setCar(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch car details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to book a car');
      navigate('/login');
      return;
    }
    setShowBookingModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Car not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={car.images[0] || 'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&q=80'}
              alt={`${car.make} ${car.model}`}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {car.images.slice(1).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${car.make} ${car.model}`}
                className="w-full h-20 object-cover rounded-lg cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* Car Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {car.make} {car.model} {car.year}
            </h1>
            <p className="text-2xl font-semibold text-blue-600 mt-2">
              ${car.dailyRate}/day
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-gray-500" />
              <span>{car.transmission}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Fuel className="h-5 w-5 text-gray-500" />
              <span>{car.category.name}</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Features</h3>
            <ul className="grid grid-cols-2 gap-2">
              {car.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleBookNow}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Book Now
          </button>
        </div>
      </div>

      {showBookingModal && (
        <BookingModal
          car={car}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            setShowBookingModal(false);
            navigate('/bookings');
          }}
        />
      )}
    </div>
  );
};

export default CarDetails;