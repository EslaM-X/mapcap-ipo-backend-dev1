/**
 * Global Configuration Schema v1.1.1
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Dynamic System Parameters
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Stores global-level variables (e.g., PI_PRICE, IPO_STATE, SYSTEM_PULSE).
 * Optimized to serve as a Single Source of Truth for the MERN Frontend.
 */

import mongoose from 'mongoose';

const globalConfigSchema = new mongoose.Schema({
    /**
     * @property {String} key
     * Unique identifier (e.g., 'SYSTEM_PULSE', 'IPO_LIMITS').
     */
    key: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        uppercase: true // Ensures consistency: 'system_pulse' becomes 'SYSTEM_PULSE'
    },

    /**
     * @property {Mixed} value
     * Flexible storage for numbers, strings, or complex objects.
     * Use this for 'piPrice' or 'totalPool' metrics.
     */
    value: { 
        type: mongoose.Schema.Types.Mixed, 
        required: true 
    },

    /**
     * @property {String} description
     * Audit notes for Daniel to ensure operational transparency.
     */
    description: {
        type: String,
        trim: true
    },

    /**
     * @property {Date} updatedAt
     * Automatically managed by timestamps. Used by Frontend to show "Last Synced".
     */
}, { 
    timestamps: true,
    minimize: false // Ensures empty objects {} are still saved in DB (important for initial states)
});

/**
 * PERFORMANCE INDEXING:
 * Accelerates 'key' based lookups which are frequent during Dashboard pulse updates.
 */
globalConfigSchema.index({ key: 1 });

const GlobalConfig = mongoose.models.GlobalConfig || mongoose.model('GlobalConfig', globalConfigSchema);

export default GlobalConfig;
