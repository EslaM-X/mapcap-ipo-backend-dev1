/**
 * Logger Configuration - Audit Trail Engine v1.7.5 (TS-Standard)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Transparency Standard
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Implemented strict severity level union types.
 * - Optimized directory resolution for cross-environment compatibility.
 * - Preserved legacy export names (auditLogStream, writeAuditLog) to prevent 
 * system-wide breakage in middleware and services.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM-compliant __dirname resolution for modern Node.js environments
const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

/**
 * CLOUD & LOCAL OPTIMIZATION: 
 * Ensures the system adapts to read-only environments (Vercel) by using /tmp
 * and maintains local persistence for Termux/Staging.
 */
const isProduction: boolean = process.env.NODE_ENV === 'production';
const logDir: string = isProduction ? '/tmp' : path.join(__dirname, '../../logs');
const logFile: string = path.join(logDir, 'audit.log'); // Aligned with your project structure

// Integrity Check: Ensuring log persistence structure exists in dev environments
if (!isProduction && !fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

/**
 * @export auditLogStream
 * Preserved nomenclature for 'morgan' or 'server.ts' middleware.
 */
export const auditLogStream: fs.WriteStream = fs.createWriteStream(logFile, { 
    flags: 'a',
    encoding: 'utf8'
});

/**
 * @function writeAuditLog
 * Centralized logging engine for MapCap ecosystem events.
 * @param level - Log severity (INFO, WARN, ERROR, CRITICAL).
 * @param message - Detailed event description.
 */
export const writeAuditLog = (
    level: 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL', 
    message: string
): void => {
    const timestamp: string = new Date().toISOString();
    const entry: string = `${timestamp} - [${level.toUpperCase()}]: ${message}\n`;
    
    // Persistent write attempt (Handles cloud ephemeral storage gracefully)
    try {
        auditLogStream.write(entry);
    } catch (err: any) {
        // Fallback to console if file-system is strictly locked
        console.error(`[AUDIT_LOG_FAILURE] Storage write error: ${err.message}`);
    }
    
    /**
     * CONSOLE VISIBILITY PROTOCOL:
     * Utilizes ANSI colors for immediate visual prioritization in CI/CD logs.
     */
    if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
        console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // Red for errors
    } else {
        console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // Green for info
    }
};

// INITIALIZATION: Confirming Audit Engine Readiness
writeAuditLog('INFO', 'MapCap Audit Engine v1.7.5 TS Synchronized.');

export default { auditLogStream, writeAuditLog };
