/**
 * MapCap IPO - Integrated Server Engine
 * ---------------------------------------------------------
 * Final Orchestration of IPO Metrics, Security, and Logging.
 * Optimized for the Philip Jennings Use Case (4-Week Cycle).
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const auditLogStream = require('./src/config/logger');
const Investor = require('./src/models/Investor');

// Import Routes
const ipoRoutes = require('./src/routes/ipo.routes');
const adminRoutes = require('./src/routes/admin/admin.routes');

const app = express();

// 1. Logging & Security Middleware
// Records every request into the audit.log for Daniel's review
app.use(morgan('combined', { stream: auditLogStream }));
app.use(express.json());
app.use(cors());

// 2. Database Connectivity
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Audit System: Database Connected'))
  .catch(err => console.error('❌ DB Error:', err));

/**
 * 3. ADVANCED HEALTH ROUTE (The "Pulse" Check)
 * Provides real-time "Water-Level" metrics for Philip and Daniel.
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

        res.status(200).json({
            status: "Pulse Active",
            project: "MapCap IPO",
            live_metrics: {
                current_water_level: waterLevel, // Value 2
                active_pioneers: pioneers,      // Value 1
                ipo_capacity_percentage: ((waterLevel / 2181818) * 100).toFixed(2) + "%"
            },
            security: "Whale-Shield Level 4 Active",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ status: "Error", message: error.message });
    }
});

// 4. Route Mapping
app.use('/api/ipo', ipoRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 IPO Engine deployed on port ${PORT}`);
    console.log(`📜 System Logs are being recorded in /logs/audit.log`);
});
