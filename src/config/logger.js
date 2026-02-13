/**
 * Logger Configuration - Audit Trail Engine v1.5 (Stabilized for Vercel)
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Transparency Standard
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM-compliant __dirname resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * VERCEL READ-ONLY FIX: 
 * Vercel environment is read-only. We use '/tmp' for logs in production 
 * to prevent '500 Internal Server Error' during write attempts.
 */
const isProduction = process.env.NODE_ENV === 'production';
const logDir = isProduction ? '/tmp' : path.join(__dirname, '../../logs');
const logFile = path.join(logDir, 'financial_audit.log');

// Directory Integrity Check
if (!isProduction && !fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

/**
 * @export auditLogStream
 * Maintains exact same naming to prevent breaking server.js or morgan integration.
 */
export const auditLogStream = fs.createWriteStream(logFile, { 
    flags: 'a',
    encoding: 'utf8'
});

/**
 * @function writeAuditLog
 * Logic preserved to ensure Whale-Shield alerts and A2UaaS integrity remain intact.
 */
export const writeAuditLog = (level, message) => {
    const timestamp = new Date().toISOString();
    const entry = `${timestamp} - [${level.toUpperCase()}]: ${message}\n`;
    
    // Attempting persistent write (fails gracefully in strictly read-only envs)
    try {
        auditLogStream.write(entry);
    } catch (err) {
        console.error(`[LOG_ERROR] Could not write to audit file: ${err.message}`);
    }
    
    // Critical console output for real-time monitoring via Vercel Logs
    if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
        console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`);
    } else {
        console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`);
    }
};

// Initializing Engine Boot Log
writeAuditLog('INFO', 'MapCap Audit Engine Synchronized for Cloud Deployment.');

export default { auditLogStream, writeAuditLog };
