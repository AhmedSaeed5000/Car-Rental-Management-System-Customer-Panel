import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51QTkQmDZlizXk7Lk70qQ9Plm56drhxoJX3G8LoN4EoRWDiXbNUoBKHrunOBvEAO5CtIbFN4PP5ZqrwfSWIPAJ2Ic00qwUKy6OH');

const PaymentModal = ({ bookingDetails }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    const stripe = await stripePromise;

    // Call your backend to create a payment intent
    const response = await fetch('http://localhost:3002/payments/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: bookingDetails.totalAmount }),
    });

    const { clientSecret } = await response.json();

    // Confirm the payment with the client secret
    const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement, // Reference to your card element
      },
    });

    if (stripeError) {
      setError(stripeError.message);
    } else {
      // Payment succeeded
      console.log('Payment successful!');
    }
    setLoading(false);
  };

  return (
    <div>
      {/* Your modal UI here */}
      <button onClick={handlePayment} disabled={loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
      {error && <div>{error}</div>}
    </div>
  );
};

export default PaymentModal; 