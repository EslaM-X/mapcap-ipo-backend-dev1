/**
 * Logger Configuration - Audit Trail Engine
 * ---------------------------------------------------------
 * Implements a permanent record of all financial movements,
 * specifically targeting Whale Refunds and A2UaaS failures.
 * This ensures "Daniel's Transparency Standard" is met.
 */

const fs = require('fs');
const path = require('path');

// Create a write stream for the audit log in append mode
const auditLogStream = fs.createWriteStream(
    path.join(__dirname, '../../logs/audit.log'), 
    { flags: 'a' }
);

module.exports = auditLogStream;

