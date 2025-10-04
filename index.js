
// Import necessary packages
const express = require('express');
const cors = require('cors');

require('dotenv').config(); // Load environment variables from .env file

const connectDB = require('./config/db');

// Import route files
const userRoutes = require('./routes/userRoutes');
const listingRoutes = require('./routes/listingRoutes');

// Connect to the database
connectDB();
// Create an Express app
const app = express();

// Set the port from environment variables, or default to 5000
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow the server to accept JSON in the request body
app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);


// A simple test route to make sure the server is working
app.get('/', (req, res) => {
  res.send('E-Waste Marketplace API is running!');
});
// Start the server and listen for requests on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});