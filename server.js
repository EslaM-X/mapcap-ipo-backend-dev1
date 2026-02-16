/**
 * MapCap IPO - Core Server Orchestrator v1.6.7 (Stabilized)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel Compliance
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Orchestrates Express pipeline, database persistence, and security gateways.
 * Optimized for MERN stack integration and stable Termux testing.
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

// Load Environment Configuration
dotenv.config();

const app = express();

/**
 * 1. GLOBAL MIDDLEWARE & SECURITY FRAMEWORK
 * Configures cross-origin policies for Frontend Dashboard stability.
 */
app.use(morgan('combined', { stream: auditLogStream }));
app.use(express.json());

// UPDATED: Added 'x-admin-token' to allowedHeaders for Frontend-to-Backend security handshake
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-token'] 
}));

/**
 * 2. DATABASE PERSISTENCE LAYER
 * Logic refined to allow Test Suites (v1.1.1) to manage lifecycle.
 */
const connectDB = async () => {
    try {
        if (process.env.NODE_ENV === 'test') return;

        const dbUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mapcap_dev';
        await mongoose.connect(dbUri);
        
        console.log(`✅ [DATABASE] Ledger Connection: SUCCESS (${process.env.NODE_ENV || 'dev'})`);
        writeAuditLog('INFO', 'Database Connection Established.');

        /**
         * CRON INITIALIZATION:
         * Strictly isolated from the 'test' environment to prevent ledger pollution.
         */
        if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
            CronScheduler.init();
        }
    } catch (err) {
        console.error('❌ [CRITICAL] Database Connection Failed:', err.message);
        writeAuditLog('CRITICAL', `DB Connection Error: ${err.message}`);
    }
};

/**
 * 3. EXECUTION GUARD: DATABASE INITIALIZATION
 */
if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

/**
 * 4. SYSTEM PULSE CHECK (Real-Time Metrics)
 * High-performance aggregation for the Pulse Dashboard 'Water-Level' Graph.
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
 * 5. ROUTE ARCHITECTURE
 * Dual-prefix support for Frontend stability across version transitions.
 */
app.use('/api/v1/ipo', ipoRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/ipo', ipoRoutes);     
app.use('/api/admin', adminRoutes); 

/**
 * 6. GLOBAL EXCEPTION INTERCEPTOR
 */
app.use((err, req, res, next) => {
    writeAuditLog('CRITICAL', `FATAL EXCEPTION: ${err.stack}`);
    return res.status(500).json({
        success: false,
        error: "Internal System Anomaly",
        message: "Financial audit log generated."
    });
});

/**
 * 7. SERVER EXECUTION (ENVIRONMENTAL GUARD)
 * Optimized for Termux / CI-CD execution.
 */
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 [ENGINE] MapCap IPO Pulse v1.6.7 deployed on port ${PORT}`);
    });
}

export default app;
