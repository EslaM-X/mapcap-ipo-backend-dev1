/**
 * Admin Account Schema v1.5
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Security & Compliance
 * * PURPOSE:
 * Defines administrative credentials and access levels.
 * Supports granular Role-Based Access Control (RBAC) to ensure 
 * separation of duties between Operations (Philip) and Auditing (Daniel).
 * ---------------------------------------------------------
 */

import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
    /**
     * @property {String} username
     * Unique identifier for the administrator (e.g., 'philip_admin').
     */
    username: { 
        type: String, 
        required: [true, 'Admin username is required'], 
        unique: true,
        trim: true,
        lowercase: true
    },

    /**
     * @property {String} password
     * Hashed credential. 
     * NOTE: Must be processed via bcrypt before saving in AuthController.
     */
    password: {
        type: String,
        required: [true, 'Secure password hash is mandatory'],
        select: false // Ensures password isn't leaked in general API queries
    },
    
    /**
     * @property {String} role
     * Access Level Definition:
     * - SUPER_ADMIN: Full control (Philip)
     * - AUDITOR: Read-only access to financial logs (Daniel)
     */
    role: { 
        type: String, 
        enum: ['SUPER_ADMIN', 'AUDITOR'], 
        default: 'SUPER_ADMIN' 
    },

    /**
     * @property {Date} lastLogin
     * Security Audit Trail: Tracks the last time the dashboard was accessed.
     */
    lastLogin: { 
        type: Date 
    },

    /**
     * @property {Boolean} isActive
     * Kill-switch for admin access in case of credential compromise.
     */
    isActive: {
        type: Boolean,
        default: true
    }
}, { 
    /**
     * Timestamps for compliance tracking.
     */
    timestamps: true 
});

// Adding index for high-speed authentication lookups
AdminSchema.index({ username: 1, isActive: 1 });

const Admin = mongoose.model('Admin', AdminSchema);

export default Admin;
