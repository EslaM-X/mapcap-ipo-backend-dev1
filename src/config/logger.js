/**
 * Logger Configuration - Audit Trail Engine v1.2
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem Security (MERN Stack)
 * * * Purpose:
 * Implements a permanent, immutable record of all financial movements.
 * Specifically monitors:
 * 1. Whale-Shield Activations (10% Cap Enforcement)
 * 2. A2UaaS (Asset-to-User) Transaction Failures
 * 3. Pi SDK Handshake Anomalies
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Utility to handle __dirname in ES Modules environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the absolute path for financial audit logs
const logDir = path.join(__dirname, '../../logs');
const logFile = path.join(logDir, 'audit.log');

/**
 * DIRECTORY INTEGRITY CHECK
 * Ensures the 'logs' folder exists before initializing the stream,
 * preventing server crashes on new deployments.
 */
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

/**
 * AUDIT LOG STREAM
 * Implements an 'Append-Only' stream to preserve financial history.
 * Daniel's Transparency Standard: Flags 'a' ensures no data is overwritten.
 */
export const auditLogStream = fs.createWriteStream(logFile, { 
    flags: 'a',
    encoding: 'utf8'
});

// Strategic Log Entry: Record Engine Boot Sequence
const bootEntry = `${new Date().toISOString()} - [SYSTEM]: MapCap Audit Engine Reinitialized.\n`;
auditLogStream.write(bootEntry);

export default auditLogStream;
