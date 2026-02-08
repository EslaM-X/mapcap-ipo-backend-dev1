/**
 * MapCap IPO - Main Server Entry Point (Full Integration)
 * -------------------------------------------------------------------------
 * This server orchestrates the 4-week MapCap IPO lifecycle. 
 * Integrated with EscrowPi A2UaaS, Dynamic Spot Pricing, and Admin Controls.
 * Based on the Use Case by Philip Jennings (Feb 6th, 2026).
 */

require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 1. Import Routes (Aligned with the new directory structure)
const ipoRoutes = require('./src/routes/ipo.routes');
const adminRoutes = require('./src/routes/admin/admin.routes'); [span_1](start_span)// Essential for Philip/Daniel[span_1](end_span)

const app = express();

[span_2](start_span)// Middleware - Optimized for Smartphone usability[span_2](end_span)
app.use(express.json());
app.use(cors());

[span_3](start_span)// 2. Database Connection - Ensuring persistence for Value 1, 2, and 3[span_3](end_span)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MapCapIPO Database Connected Successfully'))
  .catch(err => console.error('❌ DB Connection Error:', err));

/**
 * 3. Route Mapping
 * -----------------
 * [span_4](start_span)/api/ipo: Public routes for the Single Screen (Stats, Invest, Withdraw)[span_4](end_span)
 * [span_5](start_span)/api/admin: Protected routes for Settlement, Authentication, and Health[span_5](end_span)
 */
app.use('/api/ipo', ipoRoutes);
app.use('/api/admin', adminRoutes);

/**
 * 4. Global Health Check
 * Confirms the "IPO Pulse" is active.
 */
app.get('/', (req, res) => {
  res.status(200).json({
    status: "Operational",
    project: "MapCap IPO",
    [span_6](start_span)phase: "IPO Phase (Fixed 4-Week Duration)", //[span_6](end_span)
    systemTime: new Date().toISOString()
  });
});

/**
 * 5. Error Handling Middleware
 * Ensures the app doesn't crash during the high-intensity IPO period.
 */
app.use((err, req, res, next) => {
    console.error(`[SERVER ERROR]: ${err.stack}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
});

// Server Execution
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 MapCap IPO Server running on port ${PORT}`);
  [span_7](start_span)[span_8](start_span)console.log(`--- [INFO] 10% Whale Cap rules initialized.`); //[span_7](end_span)[span_8](end_span)
  console.log(`--- [INFO] EscrowPi A2UaaS connectivity enabled.`); [span_9](start_span)//[span_9](end_span)
});
