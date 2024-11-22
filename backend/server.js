const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config();

// App setup
const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON

// Import routes
const rideRoutes = require('./routes/rideRoutes');
const driverRoutes = require('./routes/driverRoutes');

// Route prefixes
app.use('/api/rides', rideRoutes);
app.use('/api/drivers', driverRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Catch-all handler for any request that doesn't match an API route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
