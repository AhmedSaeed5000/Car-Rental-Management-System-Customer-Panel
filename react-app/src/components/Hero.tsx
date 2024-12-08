import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Search } from 'lucide-react';

export const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 min-h-[600px]">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&q=80"
          alt="Luxury car"
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
            <span className="block">Premium Car Rental</span>
            <span className="block text-blue-200">For Your Journey</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-blue-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Experience luxury and comfort with our premium fleet of vehicles. Book your perfect ride today.
          </p>
          
          <div className="mt-10 flex justify-center gap-4">
            <button
              onClick={() => navigate('/cars')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 transition-colors"
            >
              <Car className="mr-2 h-5 w-5" />
              View Available Cars
            </button>
            <button
              onClick={() => navigate('/search')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors"
            >
              <Search className="mr-2 h-5 w-5" />
              Search Cars
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};