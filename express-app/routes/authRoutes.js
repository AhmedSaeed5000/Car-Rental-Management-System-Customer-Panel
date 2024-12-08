const express = require('express');
const { registerUser, loginUser, googleLogin } = require('../controllers/authController');
const router = express.Router();

// Routes
router.post('/register', registerUser); // Conventional Registration
router.post('/login', loginUser); // Conventional Login
router.post('/google-login', googleLogin); // Google OAuth Login

module.exports = router;
