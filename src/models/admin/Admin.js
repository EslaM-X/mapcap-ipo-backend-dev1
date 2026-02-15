/**
 * Admin Account Schema v1.5.1 (Executive Access Layer)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Security & Compliance Standard
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Defines administrative credentials and granular access levels (RBAC).
 * Engineered to provide a secure environment for Philip (Operations) 
 * and Daniel (Auditing), ensuring strict separation of administrative duties.
 * -------------------------------------------------------------------------
 */

import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
    /**
     * @property {String} username
     * Unique identifier for the administrator.
     * Enforces lowercase and trimming for high-fidelity login synchronization.
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
     * High-entropy hashed credential.
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
     * - SUPER_ADMIN: Full ecosystem oversight and settlement execution (Philip).
     * - AUDITOR: Read-only access to ledger logs and A2UaaS records (Daniel).
     */
    role: { 
        type: String, 
        enum: ['SUPER_ADMIN', 'AUDITOR'], 
        default: 'SUPER_ADMIN' 
    },

    /**
     * @property {Date} lastLogin
     * Security Audit Trail: Monitors the most recent dashboard session.
     */
    lastLogin: { 
        type: Date 
    },

    /**
     * @property {Boolean} isActive
     * Global Kill-Switch: Allows immediate suspension of admin privileges
     * in the event of credential compromise.
     */
    isActive: {
        type: Boolean,
        default: true
    }
}, { 
    /**
     * timestamps: Automatic creation of 'createdAt' and 'updatedAt' for Daniel's compliance reports.
     */
    timestamps: true 
});

/**
 * INDEXING STRATEGY: 
 * Optimized for high-speed authentication and status checks.
 */
AdminSchema.index({ username: 1, isActive: 1 });

const Admin = mongoose.model('Admin', AdminSchema);

export default Admin;
