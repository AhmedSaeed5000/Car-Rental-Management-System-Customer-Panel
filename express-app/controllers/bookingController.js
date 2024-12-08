const Booking = require('../models/Booking');
const Car = require('../models/Car');
const Payment = require('../models/Payment')
const { sendEmail } = require('../utils/emailService');
const { createPayment } = require('../controllers/paymentController')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const {
      customer,
      car,
      pickupBranch,
      returnBranch,
      startDate,
      endDate,
      paymentMethod,
    } = req.body;

    const carData = await Car.findById(car);
    console.log(carData.dailyRate)
    if (!carData || carData.status !== 'available') {
      return res.status(400).json({ error: 'Car is not available for booking' });
    }

    const rentalDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    const totalAmount = rentalDays * carData.dailyRate;

    const newBooking = new Booking({
      customer,
      car,
      pickupBranch,
      returnBranch,
      startDate,
      endDate,
      totalAmount,
      paymentMethod,
      status: 'pending', // Initially set to pending
    });

    const savedBooking = await newBooking.save();

    // Create a new payment associated with the booking
    let paymentStatus = 'pending'; // Default status for cash
    let stripePaymentIntentId = null;

    if (paymentMethod === 'stripe') {
      // Create a Stripe payment intent
      // const paymentIntent = await stripe.paymentIntents.create({
      //   amount: totalAmount * 100, // Convert to cents
      //   currency: 'usd',
      //   payment_method: req.body.paymentMethodId,
      //   confirmation_method: 'manual',
      //   confirm: true,
      // });

      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount * 100,
        currency: 'usd',
        automatic_payment_methods: { enabled: true }, // Automatically select methods
      });
      
      

      stripePaymentIntentId = paymentIntent.id;
      paymentStatus = 'completed'; // Mark the payment as completed for stripe
    }

    console.log(req.user._id);

    // Create a new payment document
    const newPayment = new Payment({
      booking: savedBooking._id,
      amount: totalAmount,
      paymentMethod,
      status: paymentStatus,
      stripePaymentIntentId,
      paidBy: req.user.id, // Ensure this comes from the authenticated user
    });

    const savedPayment = await newPayment.save();

    // Update the car status to rented
    carData.status = 'rented';
    await carData.save();

    // Send confirmation email based on payment method
    if (paymentMethod === 'cash') {
      // Notify the user that payment is pending for cash
      await sendEmail({
        to: req.user.email,
        subject: 'Booking Confirmation (Pending Payment)',
        text: `Your booking for the car ${carData.make} ${carData.model} is pending. Please make the cash payment.`,
        html: `<p>Your booking for the car <strong>${carData.make} ${carData.model}</strong> is pending. Please make the cash payment.</p>`,
      });
    } else if (paymentMethod === 'stripe') {
      // Notify the user that payment is confirmed for Stripe
      await sendEmail({
        to: req.user.email,
        subject: 'Booking Confirmation (Payment Received)',
        text: `Your booking for the car ${carData.make} ${carData.model} has been confirmed and the online payment has been received.`,
        html: `<p>Your booking for the car <strong>${carData.make} ${carData.model}</strong> has been confirmed. The online payment has been received. Pickup: ${startDate}, Return: ${endDate}</p>`,
      });
    }

    res.status(201).json({ message: 'Booking created successfully', booking: savedBooking, payment: savedPayment });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: error.message });
  }
};


// Cancel a booking
exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId).populate('car');
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    const car = await Car.findById(booking.car);
    if (car) {
      car.status = 'available';
      await car.save();
    }

    // Send cancellation email
    await sendEmail({
      to: req.user.email,
      subject: 'Booking Cancelled',
      text: `Your booking for the car ${car.make} ${car.model} has been cancelled.`,
      html: `<p>Your booking for the car <strong>${car.make} ${car.model}</strong> has been cancelled.</p>`,
    });

    res.status(200).json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a booking
exports.updateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const updates = req.body;

    const updatedBooking = await Booking.findByIdAndUpdate(bookingId, updates, { new: true }).populate('car');

    if (!updatedBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Notify user if status is changed to "completed"
    if (updates.status === 'completed') {
      await sendEmail({
        to: req.user.email,
        subject: 'Car Return Reminder',
        text: `Your booking for the car ${updatedBooking.car.make} ${updatedBooking.car.model} is now marked as completed. Please return the car.`,
        html: `<p>Your booking for the car <strong>${updatedBooking.car.make} ${updatedBooking.car.model}</strong> is now marked as completed. Please return the car.</p>`,
      });
    }

    res.status(200).json({ message: 'Booking updated successfully', booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCustomerBookings = async (req, res) => {
    try {
      const { customerId } = req.params;
  
      // Validate customerId
      if (!customerId) {
        return res.status(400).json({ message: 'Customer ID is required' });
      }
  
      // Fetch bookings for the customer
      const bookings = await Booking.find({ customer: customerId })
        .populate('car', 'make model year')
        .populate('pickupBranch', 'name address')
        .populate('returnBranch', 'name address')
        .exec();
  
      // Respond with the bookings
      res.status(200).json({ success: true, bookings });
    } catch (error) {
      console.error('Error fetching customer bookings:', error);
      res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
    }
  };
