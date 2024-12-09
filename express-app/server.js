const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

app.use(cors()); // Allow all origins by default

// Routes
const authRoutes = require('./routes/authRoutes');
console.log(1);
const carRoutes = require('./routes/carRoutes');
console.log(2);
const branchRoutes = require('./routes/branchRoutes');
console.log(3);
const categoryRoutes = require('./routes/categoryRoutes');
console.log(4);
const bookingRoutes = require('./routes/bookingRoutes');
console.log(5);
app.use('/auth', authRoutes);
app.use('/cars', carRoutes);
app.use('/branch', branchRoutes);
app.use('/category', categoryRoutes);
app.use('/booking', bookingRoutes);



// Connect to the database and start the server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
