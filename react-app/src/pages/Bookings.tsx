import React, { useState, useEffect } from 'react';
import { bookings } from '../services/api';
import { Booking } from '../types';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, DollarSign, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Bookings = () => {
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserBookings();
    }
  }, [user]);

  const fetchUserBookings = async () => {
    try {
      const response = await bookings.getCustomerBookings(user!.id);
      setUserBookings(response.data.bookings);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await bookings.cancel(bookingId);
      toast.success('Booking cancelled successfully');
      fetchUserBookings();
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

      {userBookings.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">You don't have any bookings yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {userBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {booking.car.make} {booking.car.model}
                    </h3>
                    <p className="text-gray-600">{booking.car.year}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">Start Date</span>
                    </div>
                    <p className="font-medium">
                      {new Date(booking.startDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">End Date</span>
                    </div>
                    <p className="font-medium">
                      {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span className="text-sm">Total Amount</span>
                    </div>
                    <p className="font-medium">${booking.totalAmount}</p>
                  </div>
                </div>

                <div className="mt-4 md:mt-0">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {booking.status}
                  </span>
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="ml-4 text-red-600 hover:text-red-800"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;