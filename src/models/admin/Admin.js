/**
 * Admin Account Schema
 * ---------------------------------------------------------
 * Defines the structure for administrative users.
 * Supports role-based access control (RBAC) if the ecosystem expands.
 */
const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    role: { 
        type: String, 
        enum: ['SUPER_ADMIN', 'AUDITOR'], 
        default: 'SUPER_ADMIN' 
    },
    lastLogin: { 
        type: Date 
    }
}, { timestamps: true });

module.exports = mongoose.model('Admin', AdminSchema);
