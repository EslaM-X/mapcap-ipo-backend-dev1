/**
 * Global Configuration Schema v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Dynamic System Parameters
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Implemented IGlobalConfig interface for strict key-value typing.
 * - Maintained Schema.Types.Mixed for maximum architectural flexibility.
 * - Enforced uppercase transformation for key consistency.
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * @interface IGlobalConfig
 * Represents a single global parameter entry.
 */
export interface IGlobalConfig extends Document {
    key: string;
    value: any; // Using 'any' to mirror Mixed type flexibility
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const globalConfigSchema: Schema<IGlobalConfig> = new Schema({
    /**
     * @property {String} key
     * Unique identifier (e.g., 'SYSTEM_PULSE', 'PI_PRICE').
     */
    key: { 
        type: String, 
        required: [true, 'Configuration key is mandatory'], 
        unique: true, 
        trim: true, 
        uppercase: true 
    },

    /**
     * @property {Mixed} value
     * Flexible storage for numbers, strings, or complex objects.
     */
    value: { 
        type: Schema.Types.Mixed, 
        required: [true, 'Configuration value cannot be empty'] 
    },

    /**
     * @property {String} description
     * Contextual notes for administrative and compliance clarity.
     */
    description: {
        type: String,
        trim: true
    }
}, { 
    timestamps: true,
    minimize: false // Essential: Preserves empty objects for initial state configurations
});

/**
 * PERFORMANCE INDEXING:
 * Optimized for frequent key-based lookups during dashboard pulse cycles.
 */
globalConfigSchema.index({ key: 1 });

const GlobalConfig: Model<IGlobalConfig> = 
    mongoose.models.GlobalConfig || mongoose.model<IGlobalConfig>('GlobalConfig', globalConfigSchema);

export default GlobalConfig;
