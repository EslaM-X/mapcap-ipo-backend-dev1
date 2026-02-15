/**
 * MapCap IPO - Core Server Orchestrator v1.6.5
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel Compliance
 * -------------------------------------------------------------------------
 * ARCHITECTURAL PURPOSE:
 * Serves as the primary gateway for IPO lifecycle management and real-time 
 * metrics. Optimized for high-availability in Vercel Serverless environments.
 * -------------------------------------------------------------------------
 */

import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';

// Infrastructure & Domain Logic
import { auditLogStream, writeAuditLog } from './src/config/logger.js';
import CronScheduler from './src/jobs/cron.scheduler.js';
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
 * Enforces Daniel's Audit Standard via Morgan streaming to our custom logger.
 */
app.use(morgan('combined', { stream: auditLogStream }));
app.use(express.json());
app.use(cors({
    origin: '*', // Dynamic scaling for multi-tenant frontend access
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

/**
 * 2. DATABASE PERSISTENCE
 * Connects to the MongoDB Financial Ledger.
 */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ [DATABASE] Financial Ledger: Connection Established');
        writeAuditLog('INFO', 'Database Connection Established.');

        // Initialize Cron Jobs only if not in production (Vercel uses Cron Config)
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
 * Synchronized with server_heartbeat.test.js requirements.
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

        return res.status(200).json({
            success: true,
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
            timestamp: new Date().toISOString()
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
 * Standardized error handling to prevent Frontend crashes and maintain Daniel's Audit trail.
 */
app.use((err, req, res, next) => {
    writeAuditLog('CRITICAL', `FATAL EXCEPTION: ${err.stack}`);
    return res.status(500).json({
        success: false,
        error: "Internal System Anomaly",
        message: "Financial audit log generated for review."
    });
});

// SERVER EXECUTION
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 [ENGINE] MapCap IPO Pulse v1.6.5 deployed on port ${PORT}`);
    });
}

export default app;
