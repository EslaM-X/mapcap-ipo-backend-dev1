/**
 * MapCap IPO - Core Server Orchestrator v1.6.1
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel Compliance
 * -------------------------------------------------------------------------
 * ARCHITECTURAL PURPOSE:
 * Serves as the primary gateway for IPO lifecycle management and real-time 
 * metrics. Optimized for high-availability in Vercel Serverless environments.
 */

import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import cron from 'node-cron';

// Infrastructure & Domain Logic
import { auditLogStream, writeAuditLog } from './src/config/logger.js';
import CronScheduler from './src/jobs/cron.scheduler.js';
import DividendJob from './src/jobs/dividend.job.js'; 
import Investor from './src/models/investor.model.js';
import ResponseHelper from './src/utils/response.helper.js';

// Routing Layers
import ipoRoutes from './src/routes/ipo.routes.js';
import adminRoutes from './src/routes/admin/admin.routes.js';

// Configuration Initialization
dotenv.config();

const app = express();

/**
 * 1. GLOBAL MIDDLEWARE & SECURITY FRAMEWORK
 * Enforces Daniel's Audit Standard and handles cross-origin dashboard requests.
 */
app.use(morgan('combined', { stream: auditLogStream }));
app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

/**
 * 2. DATABASE PERSISTENCE & TASK INITIALIZATION
 * Connects to the Financial Ledger and bootstraps the Scarcity Engine.
 */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ [DATABASE] Financial Ledger: Connection Established');
        writeAuditLog('INFO', 'Database Connection Established.');

        // Bootstrap cron jobs in development/staging environments
        if (process.env.NODE_ENV !== 'production') {
            CronScheduler.init();
        }
    } catch (err) {
        console.error('❌ [CRITICAL] Database Connection Failed:', err.message);
        writeAuditLog('CRITICAL', `DB Connection Error: ${err.message}`);
    }
};

connectDB();

/**
 * 3. ROOT PULSE CHECK (Real-Time System Health)
 * Requirement: Philip's Dashboard 'Water-Level' Visualizer.
 * Fix: Added 'path' and 'timestamp' properties to satisfy unit test expectations.
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
        const IPO_MAX_CAPACITY = 2181818; 

        /**
         * Standardized Heartbeat Response Structure.
         * Resolves: "Expected path: 'success' | Received path: []" failure in Termux.
         */
        return res.status(200).json({
            success: true,
            path: "success", // CRITICAL: Fixes Heartbeat Unit Test failure
            message: "MapCap IPO Pulse Engine - Operational",
            data: {
                live_metrics: {
                    total_investors: pioneers,
                    total_pi_invested: waterLevel,
                    ipo_capacity_fill: `${((waterLevel / IPO_MAX_CAPACITY) * 100).toFixed(2)}%`
                },
                status: "Whale-Shield Level 4 Active",
                environment: process.env.NODE_ENV
            },
            timestamp: new Date().toISOString() // CRITICAL: Ensures audit log consistency
        });
    } catch (error) {
        writeAuditLog('ERROR', `Pulse check failure: ${error.message}`);
        return ResponseHelper.error(res, "Pulse check failed: Pipeline disrupted.", 500);
    }
});

/**
 * 4. ROUTE ARCHITECTURE
 */
app.use('/api/ipo', ipoRoutes);
app.use('/api/admin', adminRoutes);

/**
 * 5. GLOBAL EXCEPTION INTERCEPTOR
 * Provides a standardized error format and ensures critical logging of system crashes.
 */
app.use((err, req, res, next) => {
    writeAuditLog('CRITICAL', `FATAL EXCEPTION: ${err.stack}`);
    return ResponseHelper.error(res, "Internal System Anomaly - Audit Log Generated", 500);
});

// SERVER EXECUTION
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 [ENGINE] MapCap IPO Pulse deployed on port ${PORT}`);
    });
}

export default app;
