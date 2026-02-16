/**
 * MapCap IPO - Core Server Orchestrator v1.6.5
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel Compliance
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * This orchestrator initializes the Express pipeline, manages database 
 * persistence, and routes traffic through secured IPO and Admin gateways.
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

// Load Environment Configuration
dotenv.config();

const app = express();

/**
 * 1. GLOBAL MIDDLEWARE & SECURITY FRAMEWORK
 * Implements standard logging and Cross-Origin Resource Sharing (CORS) policies.
 */
app.use(morgan('combined', { stream: auditLogStream }));
app.use(express.json());
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

/**
 * 2. DATABASE PERSISTENCE LAYER
 * Dynamically switches between Production and Test Databases based on environment.
 */
const connectDB = async () => {
    try {
        // RATIONALE: MONGO_URI is injected by test/setup.js during Integration Suites
        const dbUri = (process.env.NODE_ENV === 'test') ? process.env.MONGO_URI : process.env.MONGO_URI;
        
        await mongoose.connect(dbUri || 'mongodb://127.0.0.1:27017/mapcap_dev');
        
        console.log(`✅ [DATABASE] Ledger Connection: SUCCESS (${process.env.NODE_ENV || 'dev'})`);
        writeAuditLog('INFO', 'Database Connection Established.');

        // Initialize Scheduled Tasks (Bypassed during Testing & Production)
        if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
            CronScheduler.init();
        }
    } catch (err) {
        console.error('❌ [CRITICAL] Database Connection Failed:', err.message);
        writeAuditLog('CRITICAL', `DB Connection Error: ${err.message}`);
    }
};

// Initiate Persistence
connectDB();

/**
 * 3. SYSTEM PULSE CHECK (Real-Time Metrics)
 * Provides an unauthenticated endpoint for monitoring IPO capacity and health.
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
 * v1 endpoints are standardized for API consumption and Integration Testing.
 */
app.use('/api/v1/ipo', ipoRoutes);
app.use('/api/v1/admin', adminRoutes);

// LEGACY SUPPORT: Ensures existing frontend integrations remain functional
app.use('/api/ipo', ipoRoutes);     
app.use('/api/admin', adminRoutes); 

/**
 * 5. GLOBAL EXCEPTION INTERCEPTOR
 * Final safety net for unhandled errors to maintain system stability.
 */
app.use((err, req, res, next) => {
    writeAuditLog('CRITICAL', `FATAL EXCEPTION: ${err.stack}`);
    return res.status(500).json({
        success: false,
        error: "Internal System Anomaly",
        message: "Financial audit log generated for review."
    });
});

/**
 * 6. SERVER EXECUTION (ENVIRONMENTAL GUARD)
 * Prevents the server from auto-starting during Jest runs to avoid EADDRINUSE errors.
 */
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 [ENGINE] MapCap IPO Pulse v1.6.5 deployed on port ${PORT}`);
    });
}

// Export for Supertest compatibility
export default app;
