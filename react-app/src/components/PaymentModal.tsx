import React from 'react';

interface BookingDetails {
  // Add the properties that your booking details object contains
  [key: string]: any; // This is a temporary type, replace with actual properties
}

interface PaymentModalProps {
  bookingDetails: BookingDetails;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ bookingDetails }) => {
  // Your payment modal implementation here
  return (
    <div>
      {/* Your payment modal JSX */}
    </div>
  );
};

export default PaymentModal; 