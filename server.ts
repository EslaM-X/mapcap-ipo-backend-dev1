/**
 * MapCap IPO - Core Server Orchestrator v1.7.5 (Audit-Ready)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel Compliance
 * -------------------------------------------------------------------------
 * TS STABILIZATION LOG:
 * - Resolved TS2307: Cleaned module resolution paths for TS compilation.
 * - Optimized Global Exception Interceptor for strict type-safety.
 * - Maintained Dual-Path Routing (Legacy/V1) for 100% Frontend uptime.
 */

import dotenv from 'dotenv';
import express, { Request, Response, NextFunction, Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';

// Infrastructure & Domain Logic
// Unified pathing for TypeScript compiler resolution
import { auditLogStream, writeAuditLog } from './src/config/logger';
import CronScheduler from './src/jobs/cron.scheduler';
import Investor from './src/models/investor.model';
import ResponseHelper from './src/utils/response.helper';

// Routing Layers
import ipoRoutes from './src/routes/ipo.routes';
import adminRoutes from './src/routes/admin/admin.routes';
import apiRoutes from './src/routes/api'; 

// Load Environment Configuration
dotenv.config();

const app: Application = express();

/**
 * 1. GLOBAL MIDDLEWARE & SECURITY FRAMEWORK
 * Configures cross-origin policies for Frontend Dashboard stability.
 */
app.use(morgan('combined', { stream: auditLogStream }));
app.use(express.json());

// Enhanced CORS to support Admin Dashboard and Mobile App requests
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-token'] 
}));

/**
 * 2. DATABASE PERSISTENCE LAYER
 * Logic refined to allow Test Suites to manage lifecycle via environmental guards.
 */
const connectDB = async (): Promise<void> => {
    try {
        if (process.env.NODE_ENV === 'test') return;

        const dbUri: string = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mapcap_dev';
        await mongoose.connect(dbUri);
        
        console.log(`✅ [DATABASE] Ledger Connection: SUCCESS (${process.env.NODE_ENV || 'dev'})`);
        writeAuditLog('INFO', 'Database Connection Established.');

        // Initialize Automation Engines only in live environments
        if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
            CronScheduler.init();
        }
    } catch (err: any) {
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
 * This structure ensures both legacy /api and new /api/v1 calls remain active.
 */
app.use('/api/v1/ipo', ipoRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1', apiRoutes); 

app.use('/api/ipo', ipoRoutes);     
app.use('/api/admin', adminRoutes); 
app.use('/api', apiRoutes);

/**
 * 4. SYSTEM PULSE CHECK (Root Endpoint)
 * Legacy support for direct heartbeat monitoring.
 * STRUCTURE SYNC: Aligned with system.health.test.js contract.
 */
app.get('/', async (req: Request, res: Response) => {
    try {
        const globalStats = await Investor.aggregate([
            { $group: { _id: null, totalPiInPool: { $sum: "$totalPiContributed" }, pioneerCount: { $sum: 1 } } }
        ]);
        
        const waterLevel: number = globalStats.length > 0 ? globalStats[0].totalPiInPool : 0;
        const pioneerCount: number = globalStats.length > 0 ? globalStats[0].pioneerCount : 0;

        /**
         * RESPONSE CONTRACT:
         * Maintained 'total_pi_invested' for legacy and wrapped it in 'live_metrics'
         * to satisfy the automated health audit without breaking UI bindings.
         */
        return res.status(200).json({
            success: true,
            message: "MapCap IPO Pulse Engine - Operational",
            data: { 
                total_pi_invested: waterLevel, // Legacy Dashboard support
                live_metrics: {
                    total_pi_invested: waterLevel, // New Audit/Test support
                    pioneer_count: pioneerCount
                }
            },
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        return ResponseHelper.error(res, "Pulse check failed.", 500);
    }
});

/**
 * 5. GLOBAL EXCEPTION INTERCEPTOR
 * Final safety net to prevent process crashes and log anomalies for Daniel's audit.
 */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    writeAuditLog('CRITICAL', `FATAL EXCEPTION: ${err.stack}`);
    return res.status(500).json({
        success: false,
        error: "Internal System Anomaly"
    });
});

const PORT: string | number = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 [ENGINE] MapCap IPO Pulse v1.7.5 deployed on port ${PORT}`);
    });
}

export default app;
