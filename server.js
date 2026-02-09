/**
 * MapCap IPO - Integrated Server Engine (Final Production Build)
 * -------------------------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel
 * * PURPOSE:
 * Core orchestrator for the 4-week high-intensity IPO lifecycle. 
 * Manages real-time analytics, automated financial jobs, and security protocols.
 */

import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import cron from 'node-cron'; // Task scheduler for financial distributions

// Infrastructure & Logic Imports
import { auditLogStream } from './src/config/logger.js';
import CronScheduler from './src/jobs/cron.scheduler.js';
import DividendJob from './src/jobs/dividend.job.js'; // Distributed per Page 5 & 6
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
 * Logs all traffic to /logs/audit.log for compliance and troubleshooting.
 */
app.use(morgan('combined', { stream: auditLogStream }));
app.use(express.json());
app.use(cors());

/**
 * 2. DATABASE PERSISTENCE & AUTOMATION
 * High-availability connection to the MapCap IPO MongoDB cluster.
 * Background jobs are triggered only after a confirmed ledger handshake.
 */
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
      console.log('✅ [DATABASE] Financial Ledger: Connection Established');
      
      // Initialize daily pricing and vesting schedules
      CronScheduler.init();

      /**
       * 3. DIVIDEND SCHEDULE (Philip's Requirement [Page 5, 87-88])
       * Frequency is configurable. Default: Monthly (1st of every month at midnight).
       * Note: This schedule triggers the Anti-Whale Dividend Cap [Page 6, 92-94].
       */
      const DIVIDEND_POT = process.env.DIVIDEND_POT_AMOUNT || 0;
      cron.schedule('0 0 1 * *', async () => {
          console.log('--- [CRON] Starting Automated Profit Distribution ---');
          try {
              await DividendJob.distributeDividends(DIVIDEND_POT);
              console.log('--- [CRON] Dividend Distribution Cycle Completed ---');
          } catch (err) {
              console.error('[CRITICAL] Dividend Job Aborted:', err.message);
          }
      });
  })
  .catch(err => {
      console.error('❌ [CRITICAL] Database Connection Failed:', err.message);
      process.exit(1); 
  });

/**
 * 4. ROOT PULSE CHECK (Real-Time Metrics)
 * Serves the primary "Water-Level" stats for the Map of Pi dashboard [Page 4, 73-75].
 */
app.get('/', async (req, res) => {
    try {
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
        const IPO_MAX_CAPACITY = 2181818; // Fixed IPO MapCap Pool [Page 2, 26]

        return ResponseHelper.success(res, "MapCap IPO Pulse Engine - Operational", {
            project: "MapCap IPO",
            live_metrics: {
                total_investors: pioneers,       // Value 1
                total_pi_invested: waterLevel,   // Value 2
                ipo_capacity_fill: `${((waterLevel / IPO_MAX_CAPACITY) * 100).toFixed(2)}%`
            },
            status: "Whale-Shield Level 4 Active",
            uptime: `${Math.floor(process.uptime())}s`
        });
    } catch (error) {
        return ResponseHelper.error(res, "Pulse check failed: Pipeline disrupted.", 500);
    }
});

/**
 * 5. ROUTE ORCHESTRATION
 * Endpoints for the Single-Screen Pi Browser application.
 */
app.use('/api/ipo', ipoRoutes);
app.use('/api/admin', adminRoutes);

/**
 * 6. GLOBAL ERROR INTERCEPTOR
 * Final safety pillar to prevent server crashes and log fatal anomalies.
 */
app.use((err, req, res, next) => {
    console.error(`[FATAL_ERROR]: ${err.message}`);
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
