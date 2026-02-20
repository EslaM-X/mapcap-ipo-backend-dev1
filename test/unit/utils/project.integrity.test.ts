/**
 * MISSION-CRITICAL: PROJECT INTEGRITY & SECURITY ENFORCEMENT v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * LEAD ARCHITECT: EslaM-X | AppDev @Map-of-Pi
 * VERSION: Synchronized with v1.7.x Stability Standards
 * SECURITY COMPLIANCE: Daniel's Node.js Standard & Pi Network Ecosystem Spec
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Formalized JSON parsing for package.json with interface-like validation.
 * - Implemented strict versioning and engine checks for ESM environments.
 * - Enforced Version Control Security (VCS) policies for secret protection.
 * - Synchronized runtime scripts for Vercel/Termux deployment parity.
 */

import fs from 'fs';
import path from 'path';

describe('Project Integrity - Architecture & Security Policy', () => {
  // Resolved paths to core configuration files for environmental consistency
  const packagePath = path.resolve(process.cwd(), 'package.json');
  const gitignorePath = path.resolve(process.cwd(), '.gitignore');
  
  // Type-safe manifest reading
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');

  /**
   * SECTION 1: MANIFEST VALIDATION (package.json)
   * Ensures the project skeleton remains consistent with production standards.
   */
  describe('Dependency & Metadata Guard', () => {

    test('Metadata: Should align with stabilized v1.7.x and ESM standards', () => {
      /**
       * VERSION SYNC: Updated to 1.7.0 to match current deployment cycle.
       * Requirement: Name and type must remain constant for Frontend/Service discovery.
       */
      expect(pkg.name).toBe('mapcap-ipo-backend');
      expect(pkg.version).toBe('1.7.0'); 
      expect(pkg.type).toBe('module');  
    });

    test('Runtime: Must enforce Node.js >=18.0.0 for Top-level Await and stability', () => {
      // Compliance with modern Vercel/AWS/Node runtimes in 2026
      expect(pkg.engines?.node).toBe('>=18.0.0');
    });

    test('Stack: Should verify presence of Core Financial & Security libraries', () => {
      const deps = pkg.dependencies || {};
      const coreStack = ['helmet', 'mongoose', 'node-cron', 'jsonwebtoken', 'dotenv'];
      
      coreStack.forEach(dep => {
        expect(deps).toHaveProperty(dep);
      });
    });

    test('Scripts: Should define standardized entry points for Vercel/Termux', () => {
      // Crucial for deployment automation
      expect(pkg.scripts?.start).toBe('node server.js');
      expect(pkg.scripts?.dev).toBe('nodemon server.js');
    });
  });

  /**
   * SECTION 2: VERSION CONTROL SECURITY (VCS Gate)
   * Prevents critical secrets and local junk from reaching the repository.
   */
  describe('Version Control Security Policy', () => {

    test('Security: Must strictly ignore .env files to prevent credential exposure', () => {
      // Preventing catastrophic secret leaks (Pi Network API Keys / DB Credentials)
      expect(gitignoreContent).toMatch(/\.env/);
      expect(gitignoreContent).toMatch(/\.env\.local/);
    });

    test('Architecture: Should exclude node_modules and bulky log files', () => {
      expect(gitignoreContent).toMatch(/node_modules\//);
      expect(gitignoreContent).toMatch(/logs\//);
      expect(gitignoreContent).toMatch(/\*\.log/);
    });

    test('Cleanliness: Should ignore IDE-specific metadata (.vscode, .DS_Store)', () => {
      expect(gitignoreContent).toMatch(/\.vscode\//);
      expect(gitignoreContent).toMatch(/\.DS_Store/);
    });
  });
});
