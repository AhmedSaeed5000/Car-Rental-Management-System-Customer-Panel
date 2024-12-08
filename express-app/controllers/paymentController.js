const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Your Stripe secret key

// Process payment based on the payment method
exports.processPayment = async (payment) => {
  try {
    if (payment.paymentMethod === 'stripe') {
      // Handle Stripe payment processing
      const paymentIntent = await stripe.paymentIntents.create({
        amount: payment.amount * 100, // Convert amount to cents for Stripe
        currency: payment.currency,
        payment_method: payment.stripePaymentIntentId,
        confirm: true,
      });

      if (paymentIntent.status === 'succeeded') {
        payment.status = 'completed';
        await payment.save();
      } else {
        throw new Error('Stripe payment failed');
      }
    } else if (payment.paymentMethod === 'cash') {
      // Cash payments are marked as pending and don't require processing
      payment.status = 'pending';
      await payment.save();
    } else {
      throw new Error('Invalid payment method');
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    throw new Error('Payment processing failed');
  }
};

exports.createPayment = async (req, res) => {
    try {
      const { bookingId, amount, paymentMethod } = req.body;
  
      if (!bookingId || !amount || !paymentMethod) {
        return res.status(400).json({ error: 'Booking ID, amount, and payment method are required' });
      }
  
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
  
      // Create a new payment document
      const newPayment = new Payment({
        booking: bookingId,
        amount,
        paymentMethod,
        paidBy: req.user._id, // Set the logged-in user's ID
      });
  
      if (paymentMethod === 'stripe') {
        // Create a Stripe payment intent
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount * 100, // Convert to cents
          currency: 'usd',
          payment_method: req.body.paymentMethodId,
          confirmation_method: 'manual',
          confirm: true,
        });
  
        // Set the stripePaymentIntentId on the payment
        newPayment.stripePaymentIntentId = paymentIntent.id;
      }
  
      // Save the payment to the database
      const savedPayment = await newPayment.save();
  
      res.status(201).json({ message: 'Payment created successfully', payment: savedPayment });
    } catch (error) {
      console.error('Error creating payment:', error);
      res.status(500).json({ error: error.message });
    }
  };
  
// Function to update payment status if needed (e.g., webhook callback)
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId, status } = req.body;

    if (!paymentId || !status) {
      return res.status(400).json({ message: 'Payment ID and status are required' });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.status = status;
    await payment.save();

    res.status(200).json({ message: 'Payment status updated successfully', payment });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ message: 'Failed to update payment status', error: error.message });
  }
};
