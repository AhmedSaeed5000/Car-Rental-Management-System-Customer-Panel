const Car = require('../models/Car');
const Category = require('../models/Category');
const Branch = require('../models/Branch');
const axios = require('axios');

// Utility function to fetch car images from CarXE
async function fetchCarImages(make, model, year) {
    try {
      const apiKey = 'tgbukfna7_51mp52od4_nregregn71acgp8';
        const response = await axios.get(`https://api.carsxe.com/images`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Accept': 'application/json'
            },
            params: {
                make: make,
                model: model,
                year: year
            }
        });
        return response.data.images;
    } catch (error) {
        console.error('Error fetching car images:', error);
        return [];
    }
}

// Get all cars with search and filter functionality
exports.getAllCars = async (req, res) => {
    try {
        const { location, category, availability, minPrice, maxPrice, make, model } = req.query;
        
        let query = {};

        // Filter by location (branch)
        if (location) {
            const branch = await Branch.findOne({ name: { $regex: location, $options: 'i' } });
            if (branch) {
                query.branch = branch._id;
            }
        }

        // Filter by category
        if (category) {
            const categoryDoc = await Category.findOne({ name: { $regex: category, $options: 'i' } });
            if (categoryDoc) {
                query.category = categoryDoc._id;
            }
        }

        // Filter by availability
        if (availability) {
            query.status = availability === 'available' ? 'available' : { $in: ['rented', 'maintenance'] };
        }

        // Filter by price range
        if (minPrice || maxPrice) {
            query.dailyRate = {};
            if (minPrice) query.dailyRate.$gte = parseFloat(minPrice);
            if (maxPrice) query.dailyRate.$lte = parseFloat(maxPrice);
        }

        // Filter by make
        if (make) {
            query.make = { $regex: make, $options: 'i' };
        }

        // Filter by model
        if (model) {
            query.model = { $regex: model, $options: 'i' };
        }

        const cars = await Car.find(query).populate('category branch');
        res.status(200).json({ success: true, data: cars });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching cars', error: error.message });
    }
};

// Get a car by ID
exports.getCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id).populate('category branch');
        if (!car) return res.status(404).json({ success: false, message: 'Car not found' });
        res.status(200).json({ success: true, data: car });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching car', error: error.message });
    }
};

// Add a new car
exports.createCar = async (req, res) => {
    try {
        const { make, model, year, category, branch, licensePlate, dailyRate, transmission } = req.body;

        // Check if required fields are provided
        if (!make || !model || !year || !category || !branch || !licensePlate || !dailyRate || !transmission) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Validate category and branch
        const [categoryExists, branchExists] = await Promise.all([
            Category.findById(category),
            Branch.findById(branch)
        ]);

        if (!categoryExists) {
            return res.status(400).json({ success: false, message: 'Invalid category' });
        }

        if (!branchExists) {
            return res.status(400).json({ success: false, message: 'Invalid branch' });
        }

        // Fetch car images from CarXE
        const carImages = await fetchCarImages(make, model, year);

        // Prepare car data according to the schema
        const carData = {
            make,
            model,
            year,
            category,
            licensePlate,
            branch,
            dailyRate,
            status: req.body.status || 'available',
            features: req.body.features || [],
            images: carImages,
            mileage: req.body.mileage,
            transmission
        };

        const newCar = new Car(carData);
        const savedCar = await newCar.save();
        res.status(201).json({ success: true, data: savedCar });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error creating car', error: error.message });
    }
};

// Update a car
exports.updateCar = async (req, res) => {
    try {
        const updatedCar = await Car.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('category branch');
        if (!updatedCar) return res.status(404).json({ success: false, message: 'Car not found' });
        res.status(200).json({ success: true, data: updatedCar });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error updating car', error: error.message });
    }
};

// Delete a car
exports.deleteCar = async (req, res) => {
    try {
        const deletedCar = await Car.findByIdAndDelete(req.params.id);
        if (!deletedCar) return res.status(404).json({ success: false, message: 'Car not found' });
        res.status(200).json({ success: true, message: 'Car deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting car', error: error.message });
    }
};

// Get cars by category
exports.getCarsByCategory = async (req, res) => {
    try {
        const cars = await Car.find({ category: req.params.categoryId }).populate('category branch');
        res.status(200).json({ success: true, data: cars });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching cars by category', error: error.message });
    }
};

// Get cars by branch
exports.getCarsByBranch = async (req, res) => {
    try {
        const cars = await Car.find({ branch: req.params.branchId }).populate('category branch');
        res.status(200).json({ success: true, data: cars });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching cars by branch', error: error.message });
    }
};

// Get available cars
exports.getAvailableCars = async (req, res) => {
    try {
        const cars = await Car.find({ status: 'available' }).populate('category branch');
        res.status(200).json({ success: true, data: cars });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching available cars', error: error.message });
    }
};

// Update car status
exports.updateCarStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['available', 'rented', 'maintenance'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }
        const updatedCar = await Car.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        ).populate('category branch');
        if (!updatedCar) return res.status(404).json({ success: false, message: 'Car not found' });
        res.status(200).json({ success: true, data: updatedCar });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error updating car status', error: error.message });
    }
};

console.log('carController has been updated with Browse Cars feature.');

