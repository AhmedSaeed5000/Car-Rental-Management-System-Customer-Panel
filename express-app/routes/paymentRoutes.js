const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const paymentController = require('../controllers/paymentController');

// Endpoint for creating a new payment (called when booking is made)
router.post('/payments', authMiddleware, paymentController.createPayment);

// Endpoint for updating payment status (useful for webhook or manual updates)
router.put('/payments/:paymentId', authMiddleware, paymentController.updatePaymentStatus);

module.exports = router;
