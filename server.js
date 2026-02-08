/**
 * MapCap IPO - Main Server Entry Point
 * ---------------------------------------------------------
 * This server manages the 4-week high-intensity IPO cycles.
 * Features: A2UaaS Integration, Dynamic Spot Pricing, and White-Label Support.
 */

require('dotenv').config(); // Load Daniel's API Key and MongoDB URI
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Routes
const ipoRoutes = require('./src/routes/ipo.routes');

const app = express();

// Middleware - Keeping it lightweight and simple as requested by Daniel
app.use(express.json());
app.use(cors());

// Database Connection
// Connection to MongoDB for tracking investments and whale caps
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MapCapIPO Database Connected Successfully'))
  .catch(err => console.error('❌ DB Connection Error:', err));

/**
 * Route Integration
 * Mapping the IPO Pulse Dashboard and Payment endpoints
 */
app.use('/api/ipo', ipoRoutes);

// Root Health Check - Confirms the server is pulsing
app.get('/', (req, res) => {
  res.send('MapCap IPO Backend is Operational (White-Label Ready) 🚀');
});

// Server Execution
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 IPO Server is running on port ${PORT}`);
  console.log(`Duration: 4-week execution mode enabled.`);
});
