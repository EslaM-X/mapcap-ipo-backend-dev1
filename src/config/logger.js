/**
 * Logger Configuration - Audit Trail Engine v1.3
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Transparency Standard
 * * PURPOSE:
 * Implements a permanent, immutable record of financial movements.
 * Monitors: Whale-Shield alerts, A2UaaS failures, and SDK handshakes.
 * ---------------------------------------------------------
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Handling __dirname in ES Modules (Vercel/Node.js compliant)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define log paths
const logDir = path.join(__dirname, '../../logs');
const logFile = path.join(logDir, 'financial_audit.log');

/**
 * DIRECTORY INTEGRITY CHECK
 * Ensures the 'logs' folder exists to prevent deployment crashes.
 */
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

/**
 * AUDIT LOG STREAM
 * Append-only stream to preserve immutable financial history.
 */
const auditLogStream = fs.createWriteStream(logFile, { 
    flags: 'a',
    encoding: 'utf8'
});

/**
 * @function writeAuditLog
 * @desc Standardized method to write entries into the financial audit log.
 * @param {string} level - INFO, WARN, or CRITICAL.
 * @param {string} message - Descriptive log content.
 */
export const writeAuditLog = (level, message) => {
    const timestamp = new Date().toISOString();
    const entry = `${timestamp} - [${level.toUpperCase()}]: ${message}\n`;
    
    // Write to file for permanent record
    auditLogStream.write(entry);
    
    // Also output to console for real-time Vercel monitoring
    if (level === 'CRITICAL' || level === 'WARN') {
        console.error(`[AUDIT_ALERT] ${entry}`);
    } else {
        console.log(`[AUDIT_INFO] ${entry}`);
    }
};

// Log Engine Boot Sequence
writeAuditLog('INFO', 'MapCap Audit Engine Successfully Reinitialized.');

export default auditLogStream;
