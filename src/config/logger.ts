/**
 * Logger Configuration - Audit Trail Engine v1.7.5 (TypeScript Optimized)
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Transparency Standard
 * ---------------------------------------------------------
 * PURPOSE: 
 * Ensures every financial transaction and Whale-Shield event is 
 * permanently logged for audit. Optimized for high-availability 
 * cloud environments (Vercel/Node.js).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM-compliant __dirname resolution for modern Node.js environments
const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

/**
 * CLOUD DEPLOYMENT OPTIMIZATION (Vercel/AWS): 
 * Vercel's serverless environment is read-only. We utilize the '/tmp' 
 * directory for runtime logs to prevent filesystem errors.
 */
const isProduction: boolean = process.env.NODE_ENV === 'production';
const logDir: string = isProduction ? '/tmp' : path.join(__dirname, '../../logs');
const logFile: string = path.join(logDir, 'financial_audit.log');

// Integrity Check: Ensuring log persistence structure exists in dev environments
if (!isProduction && !fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

/**
 * @export auditLogStream
 * Preserved nomenclature to ensure zero breakage for 'morgan' or 'server.ts' integrations.
 */
export const auditLogStream: fs.WriteStream = fs.createWriteStream(logFile, { 
    flags: 'a',
    encoding: 'utf8'
});

/**
 * @function writeAuditLog
 * Centralized logging engine for MapCap. 
 * Essential for monitoring Whale-Shield alerts and A2UaaS transaction status.
 * @param level - Log severity (INFO, WARN, ERROR, CRITICAL).
 * @param message - Detailed event description.
 */
export const writeAuditLog = (level: 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL', message: string): void => {
    const timestamp: string = new Date().toISOString();
    const entry: string = `${timestamp} - [${level.toUpperCase()}]: ${message}\n`;
    
    // Persistent write attempt (Handles cloud ephemeral storage gracefully)
    try {
        auditLogStream.write(entry);
    } catch (err: any) {
        // Fallback to console if file-system is strictly locked
        console.error(`[AUDIT_LOG_FAILURE] Storage write error: ${err.message}`);
    }
    
    // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
    if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
        console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
    } else {
        console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
    }
};

// INITIALIZATION: Confirming Audit Engine Readiness
writeAuditLog('INFO', 'MapCap Audit Engine v1.7.5 Synchronized for Cloud Deployment.');

export default { auditLogStream, writeAuditLog };
