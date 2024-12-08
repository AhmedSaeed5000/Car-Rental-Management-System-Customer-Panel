const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

// Browse Cars - Get all cars with filters
router.get('/', carController.getAllCars);

// Get a specific car by ID
router.get('/:id', carController.getCarById);

// Create a new car
router.post('/', carController.createCar);

// Update a car
router.put('/:id', carController.updateCar);

// Delete a car
router.delete('/:id', carController.deleteCar);

// Get cars by category
router.get('/category/:categoryId', carController.getCarsByCategory);

// Get cars by branch
router.get('/branch/:branchId', carController.getCarsByBranch);

// Get available cars
router.get('/status/available', carController.getAvailableCars);

// Update car status
router.patch('/:id/status', carController.updateCarStatus);

module.exports = router;

