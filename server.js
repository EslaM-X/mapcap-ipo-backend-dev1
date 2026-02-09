/**
 * MapCap IPO - Integrated Server Engine (Final Production Build v1.1)
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
import cron from 'node-cron';

// Infrastructure & Logic Imports
import { auditLogStream, writeAuditLog } from './src/config/logger.js';
import CronScheduler from './src/jobs/cron.scheduler.js';
import DividendJob from './src/jobs/dividend.job.js'; 
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
 * Logs all traffic to audit.log via Morgan for compliance. [Spec Page 5]
 */
app.use(morgan('combined', { stream: auditLogStream }));
app.use(express.json());
app.use(cors());

/**
 * 2. DATABASE PERSISTENCE & AUTOMATION
 * Background jobs are triggered only after a confirmed ledger handshake.
 */
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
      console.log('✅ [DATABASE] Financial Ledger: Connection Established');
      writeAuditLog('INFO', 'Database Connection Established.');

      // Initialize automated tasks (Snapshots, Whale-Shield, Vesting)
      CronScheduler.init();

      /**
       * 3. DIVIDEND SCHEDULE (Philip's Requirement [Page 5, 87-88])
       * Default: Monthly (1st of every month at midnight UTC).
       */
      const DIVIDEND_POT = process.env.DIVIDEND_POT_AMOUNT || 0;
      cron.schedule('0 0 1 * *', async () => {
          writeAuditLog('INFO', '--- [CRON] Starting Automated Profit Distribution ---');
          try {
              await DividendJob.distributeDividends(DIVIDEND_POT);
              writeAuditLog('INFO', '--- [CRON] Dividend Distribution Cycle Completed ---');
          } catch (err) {
              writeAuditLog('CRITICAL', `Dividend Job Aborted: ${err.message}`);
          }
      }, { scheduled: true, timezone: "UTC" });
  })
  .catch(err => {
      console.error('❌ [CRITICAL] Database Connection Failed:', err.message);
      writeAuditLog('CRITICAL', `DB Connection Error: ${err.message}`);
      process.exit(1); 
  });

/**
 * 4. ROOT PULSE CHECK (Real-Time Metrics)
 * Serves primary "Water-Level" stats for the dashboard [Page 4, 73-75].
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
 * Ensuring routes align with the modular src/routes structure.
 */
app.use('/api/ipo', ipoRoutes);
app.use('/api/admin', adminRoutes);



/**
 * 6. GLOBAL ERROR INTERCEPTOR
 */
app.use((err, req, res, next) => {
    writeAuditLog('CRITICAL', `FATAL ERROR: ${err.stack}`);
    return ResponseHelper.error(res, "Internal System Anomaly - Audit Log Generated", 500);
});

// SERVER EXECUTION
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 [ENGINE] MapCap IPO Pulse deployed on port ${PORT}`);
    console.log(`📜 [AUDIT] Recording transactions via morgan/winston audit logs`);
});

export default app;
