/**
 * MapCap IPO - Integrated Server Engine (Final Production Build)
 * -------------------------------------------------------------------------
 * Architect: Eslam Kora | AppDev @Map-of-Pi
 * Purpose: Core orchestrator for the 4-week high-intensity IPO lifecycle.
 * * Key Features:
 * - Real-time "Water-Level" Analytics (Philip's Transparency Vision)
 * - Automated 10% Whale Cap Enforcement (Daniel's Security Protocol)
 * - Standardized ESM Architecture (Compatible with Vite/React 19)
 * - Centralized Audit Logging & Fail-Safe Error Handling
 */

import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';

// Infrastructure & Logic Imports (Standardized ES Modules)
import { auditLogStream } from './src/config/logger.js';
import CronScheduler from './src/jobs/cron.scheduler.js';
import Investor from './src/models/investor.model.js';
import ResponseHelper from './src/utils/response.helper.js';

// Routing Architecture
import ipoRoutes from './src/routes/ipo.routes.js';
import adminRoutes from './src/routes/admin/admin.routes.js';

// Load Environment Configuration
dotenv.config();

const app = express();

/**
 * 1. GLOBAL MIDDLEWARE & SECURITY
 * Implementing Daniel's transparency standard via persistent audit logging.
 * Morgan 'combined' format tracks IP, Method, and Response status for auditing.
 */
app.use(morgan('combined', { stream: auditLogStream }));
app.use(express.json());
app.use(cors());

/**
 * 2. DATABASE PERSISTENCE & AUTOMATION
 * High-availability connection to the MapCap IPO MongoDB cluster.
 * Automation starts ONLY after a successful database handshake.
 */
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
      console.log('✅ [DATABASE] Financial Ledger: Connection Established');
      
      /**
       * 3. AUTOMATION ENGINE INITIALIZATION
       * Handles Daily Pricing, Whale Refunds, and Vesting schedules automatically.
       */
      CronScheduler.init();
  })
  .catch(err => {
      console.error('❌ [CRITICAL] Database Connection Failed:', err.message);
      process.exit(1); // Immediate shutdown to prevent data inconsistency
  });

/**
 * 4. ROOT PULSE CHECK (Real-Time Metrics)
 * Serves the primary "Water-Level" stats for the Map of Pi dashboard.
 * [Philip's Requirement: High-visibility live IPO capacity]
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
        const IPO_MAX_CAPACITY = 2181818; // Strategic IPO Cap

        return ResponseHelper.success(res, "MapCap IPO Pulse Engine - Operational", {
            project: "MapCap IPO",
            phase: "4-Week Strategic Launch",
            live_metrics: {
                current_water_level: waterLevel, // Value 2
                active_pioneers: pioneers,      // Value 1
                ipo_capacity_fill: `${((waterLevel / IPO_MAX_CAPACITY) * 100).toFixed(2)}%`
            },
            security: "Whale-Shield Level 4 Active",
            uptime: `${Math.floor(process.uptime())}s`
        });
    } catch (error) {
        console.error(`[PULSE_ERROR]: ${error.message}`);
        return ResponseHelper.error(res, "Pulse check failed: Pipeline disrupted.", 500);
    }
});

/**
 * 5. ROUTE ORCHESTRATION
 * Standardized API Endpoints for the Pi Browser Single-Screen application.
 */
app.use('/api/ipo', ipoRoutes);
app.use('/api/admin', adminRoutes);

/**
 * 6. GLOBAL ERROR INTERCEPTOR (Daniel's Security Pillar)
 * Catch-all middleware to prevent memory leaks or server crashes.
 */
app.use((err, req, res, next) => {
    const errorMsg = `[FATAL_ERROR]: ${err.message}`;
    console.error(errorMsg);
    
    // Log crash details to the secure audit trail
    auditLogStream.write(`${new Date().toISOString()} - FATAL: ${err.stack}\n`);
    
    return ResponseHelper.error(res, "Internal System Anomaly - Audit Log Generated", 500);
});

// SERVER EXECUTION
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 [ENGINE] MapCap IPO Pulse deployed on port ${PORT}`);
    console.log(`📜 [AUDIT] Recording transactions to /logs/audit.log`);
});

export default app;
