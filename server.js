/**
 * MapCap IPO - Core Server Orchestrator v1.7.0 (Stabilized)
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
import apiRoutes from './src/routes/api.js'; // IMPORTED: Core API Bridge for metrics/sync

// Load Environment Configuration
dotenv.config();

const app = express();

/**
 * 1. GLOBAL MIDDLEWARE & SECURITY FRAMEWORK
 * Configures cross-origin policies for Frontend Dashboard stability.
 */
app.use(morgan('combined', { stream: auditLogStream }));
app.use(express.json());

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-token'] 
}));

/**
 * 2. DATABASE PERSISTENCE LAYER
 * Logic refined to allow Test Suites to manage lifecycle via environmental guards.
 */
const connectDB = async () => {
    try {
        if (process.env.NODE_ENV === 'test') return;

        const dbUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mapcap_dev';
        await mongoose.connect(dbUri);
        
        console.log(`✅ [DATABASE] Ledger Connection: SUCCESS (${process.env.NODE_ENV || 'dev'})`);
        writeAuditLog('INFO', 'Database Connection Established.');

        /**
         * CRON INITIALIZATION: Isolated from 'test' to prevent ledger pollution.
         */
        if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
            CronScheduler.init();
        }
    } catch (err) {
        console.error('❌ [CRITICAL] Database Connection Failed:', err.message);
        writeAuditLog('CRITICAL', `DB Connection Error: ${err.message}`);
    }
};

if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

/**
 * 3. CORE ROUTE ARCHITECTURE
 * Multi-prefix support for Frontend stability and API versioning.
 */

// A. Global Bridge Routes (Fixes 404 for metrics.sync.test.js)
app.use('/api/v1', apiRoutes); 
app.use('/api', apiRoutes);

// B. Domain Specific Routes
app.use('/api/v1/ipo', ipoRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/ipo', ipoRoutes);     
app.use('/api/admin', adminRoutes); 

/**
 * 4. SYSTEM PULSE CHECK (Root Endpoint)
 * Legacy support for direct heartbeat monitoring.
 */
app.get('/', async (req, res) => {
    try {
        const globalStats = await Investor.aggregate([
            { $group: { _id: null, totalPiInPool: { $sum: "$totalPiContributed" }, pioneerCount: { $sum: 1 } } }
        ]);
        const waterLevel = globalStats[0]?.totalPiInPool || 0;
        return res.status(200).json({
            success: true,
            message: "MapCap IPO Pulse Engine - Operational",
            data: { total_pi_invested: waterLevel },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return ResponseHelper.error(res, "Pulse check failed.", 500);
    }
});

/**
 * 5. GLOBAL EXCEPTION INTERCEPTOR
 * Final safety net to prevent process crashes and log anomalies.
 */
app.use((err, req, res, next) => {
    writeAuditLog('CRITICAL', `FATAL EXCEPTION: ${err.stack}`);
    return res.status(500).json({
        success: false,
        error: "Internal System Anomaly"
    });
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 [ENGINE] MapCap IPO Pulse v1.7.0 deployed on port ${PORT}`);
    });
}

export default app;
