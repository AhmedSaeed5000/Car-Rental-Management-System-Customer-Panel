const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware'); 

// Booking routes
router.post('/', authMiddleware, bookingController.createBooking);
router.get('/:customerId', authMiddleware, bookingController.getCustomerBookings);
router.put('/:bookingId', authMiddleware, bookingController.updateBooking);
router.delete('/:bookingId', authMiddleware, bookingController.cancelBooking);

module.exports = router;
