/**
 * Logger Configuration - Audit Trail Engine v1.4
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Transparency Standard
 * * PURPOSE:
 * Implements a permanent, immutable record of financial movements.
 * Essential for monitoring Whale-Shield alerts and A2UaaS integrity.
 * ---------------------------------------------------------
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM-compliant __dirname resolution for Node.js 18+ and Vercel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define persistent log directory and file path
const logDir = path.join(__dirname, '../../logs');
const logFile = path.join(logDir, 'financial_audit.log');

/**
 * DIRECTORY INTEGRITY CHECK
 * Ensures the 'logs' folder exists to prevent I/O deployment crashes.
 */
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

/**
 * @export auditLogStream
 * @desc Append-only stream for Morgan HTTP logging and system auditing.
 */
export const auditLogStream = fs.createWriteStream(logFile, { 
    flags: 'a',
    encoding: 'utf8'
});

/**
 * @function writeAuditLog
 * @desc Standardized method to write entries into the financial audit log.
 * @param {string} level - INFO, WARN, ERROR, or CRITICAL.
 * @param {string} message - Descriptive log content for compliance reviews.
 */
export const writeAuditLog = (level, message) => {
    const timestamp = new Date().toISOString();
    const entry = `${timestamp} - [${level.toUpperCase()}]: ${message}\n`;
    
    // Persistent write to the audit file
    auditLogStream.write(entry);
    
    // Real-time console output for Termux/Vercel monitoring with color-coding logic
    if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
        console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // Red for alerts
    } else {
        console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // Green for info
    }
};

// Initializing Engine Boot Log
writeAuditLog('INFO', 'MapCap Audit Engine Synchronized and Operational.');

/**
 * DEFAULT EXPORT:
 * Supports both named and default imports to align with server.js architecture.
 */
export default { auditLogStream, writeAuditLog };
