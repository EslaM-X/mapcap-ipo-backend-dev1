/**
 * Global Configuration Schema v1.1.0
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Dynamic System Parameters
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Stores global-level variables and system-wide toggles. This ensures 
 * that the frontend and metrics sync can read the current "IPO State" 
 * without hardcoding values.
 * -------------------------------------------------------------------------
 */

import mongoose from 'mongoose';

const globalConfigSchema = new mongoose.Schema({
    /**
     * @property {String} key
     * Unique identifier for the configuration parameter (e.g., 'IPO_STATUS', 'MAX_WHALE_CAP').
     */
    key: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true 
    },

    /**
     * @property {Mixed} value
     * Flexible value storage. Can be a String, Number, or Object.
     */
    value: { 
        type: mongoose.Schema.Types.Mixed, 
        required: true 
    },

    /**
     * @property {String} description
     * Contextual note for Daniel's audit to explain what this parameter controls.
     */
    description: {
        type: String
    },

    /**
     * @property {ObjectId} lastUpdatedBy
     * Reference to the Admin who last modified this setting for accountability.
     */
    lastUpdatedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Admin' 
    }
}, { 
    timestamps: true 
});

// Optimization for lookups by key
globalConfigSchema.index({ key: 1 });

const GlobalConfig = mongoose.models.GlobalConfig || mongoose.model('GlobalConfig', globalConfigSchema);

export default GlobalConfig;

