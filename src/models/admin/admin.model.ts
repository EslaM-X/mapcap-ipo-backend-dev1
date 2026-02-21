/**
 * Admin Account Schema v1.7.5 (TS - Executive Access Layer)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Security & Compliance Standard
 * -------------------------------------------------------------------------
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * @interface IAdmin
 * Defines the strict structure for Administrative accounts.
 */
export interface IAdmin extends Document {
    username: string;
    password?: string; // Optional because 'select: false' might exclude it
    role: 'SUPER_ADMIN' | 'AUDITOR';
    lastLogin?: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const AdminSchema: Schema<IAdmin> = new Schema({
    /**
     * @property {String} username
     * Unique identifier for the administrator.
     */
    username: { 
        type: String, 
        required: [true, 'Administrative username is mandatory'], 
        unique: true,
        trim: true,
        lowercase: true
    },

    /**
     * @property {String} password
     * Security Constraint: 'select: false' prevents accidental exposure in API logs.
     */
    password: {
        type: String,
        required: [true, 'Secure password hash is required for system entry'],
        select: false 
    },
    
    /**
     * @property {String} role
     * Access Level Definition (Role-Based Access Control):
     * - SUPER_ADMIN: Full ecosystem oversight (Philip).
     * - AUDITOR: Read-only access for compliance (Daniel).
     */
    role: { 
        type: String, 
        enum: ['SUPER_ADMIN', 'AUDITOR'], 
        default: 'SUPER_ADMIN' 
    },

    /**
     * @property {Date} lastLogin
     * Security Audit Trail.
     */
    lastLogin: { 
        type: Date 
    },

    /**
     * @property {Boolean} isActive
     * Global Kill-Switch for credential compromise.
     */
    isActive: {
        type: Boolean,
        default: true
    }
}, { 
    timestamps: true 
});

/**
 * INDEXING STRATEGY: 
 * Optimized for high-speed authentication.
 */
AdminSchema.index({ username: 1, isActive: 1 });

// Ensure we don't redefine the model if it already exists (Hot Reload Support)
const Admin: Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);

export default Admin;
