import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Car, Branch } from '../types';
import { bookings } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, X } from 'lucide-react';
import { useBranches } from '../hooks/useBranches';
import toast from 'react-hot-toast';
import PaymentModal from './PaymentModal';

interface BookingModalProps {
  car: Car;
  onClose: () => void;
  onSuccess: () => void;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PaymentForm = ({ clientSecret, onSuccess }: { clientSecret: string; onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/booking',
      },
      redirect: 'if_required',
    });

    if (error) {
      toast.error(error.message || 'Payment failed');
    } else {
      toast.success('Payment successful!');
      onSuccess();
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        type="submit"
        disabled={processing}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

const BookingModal: React.FC<BookingModalProps> = ({ car, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { branches = [], loading: loadingBranches, error: branchError } = useBranches();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pickupBranch, setPickupBranch] = useState('');
  const [returnBranch, setReturnBranch] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash payment' | 'stripe'>('cash payment');
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const calculateTotalAmount = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days * car.dailyRate;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bookingData = {
        car: car._id,
        customer: user?.id,
        pickupBranch,
        returnBranch,
        startDate,
        endDate,
        paymentMethod,
        totalAmount: calculateTotalAmount(),
      };

      if (paymentMethod === 'stripe') {
        const response = await bookings.create(bookingData);
        setClientSecret(response.data.clientSecret);
        setShowPaymentForm(true);
      } else {
        await bookings.create(bookingData);
        toast.success('Booking created successfully! Please pay at pickup.');
        onSuccess();
      }
    } catch (error) {
      toast.error('Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (branchError) {
      console.error('Branch error:', branchError);
      toast.error('Failed to load branches');
    }
  }, [branchError]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Book {car.make} {car.model}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        {loadingBranches ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2">Loading branches...</p>
          </div>
        ) : branchError ? (
          <div className="text-red-500 text-center py-4">
            <p>Error loading branches. Please try again later.</p>
          </div>
        ) : !branches?.length ? (
          <div className="text-center py-4">
            <p>No branches available.</p>
          </div>
        ) : !showPaymentForm ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Pickup Branch</label>
              <select
                value={pickupBranch}
                onChange={(e) => setPickupBranch(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select pickup branch</option>
                {branches.map((branch: Branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name} - {branch.city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Return Branch</label>
              <select
                value={returnBranch}
                onChange={(e) => setReturnBranch(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select return branch</option>
                {branches.map((branch: Branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name} - {branch.city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split('T')[0]}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as 'cash payment' | 'stripe')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="cash payment">Cash Payment</option>
                <option value="stripe">Credit Card</option>
              </select>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Total Amount:</span>
                <span className="text-xl font-bold">${calculateTotalAmount()}</span>
              </div>

              <button
                type="submit"
                disabled={loading || loadingBranches}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        ) : (
          clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm clientSecret={clientSecret} onSuccess={onSuccess} />
            </Elements>
          )
        )}
        <PaymentModal bookingDetails={{}} />
      </div>
    </div>
  );
};

export default BookingModal;