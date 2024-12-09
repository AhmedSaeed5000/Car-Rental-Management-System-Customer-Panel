import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-white px-4">
        <Car className="w-16 h-16 mb-8" />
        <h1 className="text-5xl font-bold mb-4 text-center">
          Your Journey Begins Here
        </h1>
        <p className="text-xl mb-8 text-center max-w-2xl">
          Discover our premium selection of vehicles for any occasion. 
          From luxury sedans to practical SUVs, we've got your perfect ride.
        </p>
        <button
          onClick={() => navigate('/cars')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
        >
          View Available Cars
        </button>
      </div>

      {/* Features Section */}
      <div className="relative z-10 bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Wide Selection</h3>
            <p className="text-gray-600">
              Choose from our diverse fleet of well-maintained vehicles
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Easy Booking</h3>
            <p className="text-gray-600">
              Simple and secure online reservation process
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Flexible Payment</h3>
            <p className="text-gray-600">
              Multiple payment options including cash and online payment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;