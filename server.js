/**
 * MapCap IPO - Integrated Server Engine (Final Production Build)
 * -------------------------------------------------------------------------
 * This is the core orchestrator for the 4-week high-intensity IPO lifecycle.
 * Features: 
 * - Real-time "Water-Level" Analytics (Philip's Vision)
 * - Automated 10% Whale Cap Enforcement (Daniel's Security Protocol)
 * - Persistent Audit Logging & Standardized API Responses
 * - Automated Cron Scheduling for Vesting & Settlements
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

// Infrastructure & Logic Imports
const auditLogStream = require('./src/config/logger');
const CronScheduler = require('./src/jobs/cron.scheduler');
const Investor = require('./src/models/Investor');
const ResponseHelper = require('./src/utils/response.helper');

// Routing Architecture
const ipoRoutes = require('./src/routes/ipo.routes');
const adminRoutes = require('./src/routes/admin/admin.routes');

const app = express();

/**
 * 1. GLOBAL MIDDLEWARE & SECURITY
 * Implementing Daniel's transparency standard via persistent audit logging.
 */
app.use(morgan('combined', { stream: auditLogStream }));
app.use(express.json());
app.use(cors());

/**
 * 2. DATABASE PERSISTENCE
 * Ensuring high-availability connection to the MapCap IPO data store.
 */
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
      console.log('✅ [DATABASE] Audit System: Connection Established');
      
      /**
       * 3. AUTOMATION ENGINE INITIALIZATION
       * Starting the Cron Scheduler to handle Daily Pricing, Whale Refunds, 
       * and Monthly Vesting release without manual intervention.
       */
      CronScheduler.init();
  })
  .catch(err => {
      console.error('❌ [CRITICAL] Database Connection Failed:', err.message);
      process.exit(1); // Exit process on DB failure to prevent data corruption
  });

/**
 * 4. ADVANCED PULSE CHECK (Health Route)
 * Serving the real-time "Water-Level" metrics for immediate dashboard visibility.
 */
app.get('/', async (req, res) => {
    try {
        // High-performance aggregation for total Pi volume and Pioneer count
        const globalStats = await Investor.aggregate([
            { 
                $group: { 
                    _id: null, 
                    totalPiInPool: { $sum: "$totalPiContributed" }, 
                    pioneerCount: { $sum: 1 } 
                } 
            }
        ]);

        const waterLevel = globalStats[0]?.totalPiInPool || 0;
        const pioneers = globalStats[0]?.pioneerCount || 0;

        // Utilizing ResponseHelper for a professional, standardized output
        return ResponseHelper.success(res, "MapCap IPO Pulse Engine - Status: Active", {
            project: "MapCap IPO",
            phase: "4-Week Strategic Launch",
            live_metrics: {
                current_water_level: waterLevel, // Value 2
                active_pioneers: pioneers,      // Value 1
                ipo_capacity_fill: ((waterLevel / 2181818) * 100).toFixed(2) + "%"
            },
            security: "Whale-Shield Level 4 Active",
            uptime: process.uptime()
        });
    } catch (error) {
        return ResponseHelper.error(res, "Pulse check failed: " + error.message, 500);
    }
});

/**
 * 5. ROUTE ORCHESTRATION
 * Standardized endpoints for the Pi Browser Single-Screen application.
 */
app.use('/api/ipo', ipoRoutes);
app.use('/api/admin', adminRoutes);

/**
 * 6. GLOBAL ERROR INTERCEPTOR
 * Catch-all middleware to prevent server crashes during the IPO cycle.
 */
app.use((err, req, res, next) => {
    const errorMsg = `[UNHANDLED_ERROR]: ${err.message}`;
    console.error(errorMsg);
    // Log fatal errors to the audit trail
    auditLogStream.write(`${new Date().toISOString()} - FATAL: ${err.stack}\n`);
    return ResponseHelper.error(res, "Internal Server Error - Audit Log Created", 500);
});

// SERVER EXECUTION
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 [ENGINE] MapCap IPO Pulse deployed on port ${PORT}`);
    console.log(`📜 [AUDIT] Recording transactions to /logs/audit.log`);
});
