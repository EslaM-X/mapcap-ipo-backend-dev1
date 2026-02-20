/**
 * MISSION-CRITICAL: PROJECT INTEGRITY & SECURITY ENFORCEMENT v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * LEAD ARCHITECT: EslaM-X | AppDev @Map-of-Pi
 * VERSION: Synchronized with v1.7.5 Stability Standards
 * SECURITY COMPLIANCE: Node.js Modern Standard & Pi Network Ecosystem Spec
 * -------------------------------------------------------------------------
 * TS CONVERSION & INTEGRITY LOG:
 * - Updated Versioning to 1.7.5 to match production package.json.
 * - Refactored script paths to align with 'dist/' directory for TS builds.
 * - Maintained existing test structures to ensure zero breaking changes.
 * - Enforced Version Control Security (VCS) for Pi Network API safety.
 */

import fs from 'fs';
import path from 'path';

describe('Project Integrity - Architecture & Security Policy', () => {
  // Resolved paths to core configuration files for environmental consistency
  const packagePath = path.resolve(process.cwd(), 'package.json');
  const gitignorePath = path.resolve(process.cwd(), '.gitignore');
  
  // Safe manifest reading for integrity checks
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');

  /**
   * SECTION 1: MANIFEST VALIDATION (package.json)
   * Ensures the project skeleton remains consistent with production standards.
   */
  describe('Dependency & Metadata Guard', () => {

    test('Metadata: Should align with stabilized v1.7.x and ESM standards', () => {
      /**
       * AUDIT v1.7.5: Name must remain 'mapcap-ipo-backend' for service discovery.
       * Version synchronized to 1.7.5 to reflect the latest stable build.
       */
      expect(pkg.name).toBe('mapcap-ipo-backend');
      expect(pkg.version).toBe('1.7.5'); // Synchronized with current production version
      expect(pkg.type).toBe('module');  
    });

    test('Runtime: Must enforce Node.js >=18.0.0 for Top-level Await and stability', () => {
      // Compliance with high-performance runtimes in 2026
      expect(pkg.engines?.node).toBe('>=18.0.0');
    });

    test('Stack: Should verify presence of Core Financial & Security libraries', () => {
      /**
       * CRITICAL STACK: These dependencies are vital for the MERN + AI 
       * integration as specified in the AppDev @Map-of-Pi roadmap.
       */
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      const coreStack = ['helmet', 'mongoose', 'node-cron', 'jsonwebtoken', 'dotenv'];
      
      coreStack.forEach(dep => {
        expect(deps).toHaveProperty(dep);
      });
    });

    test('Scripts: Should define standardized entry points for Vercel/Termux', () => {
      /**
       * DEPLOYMENT LOGIC: Updated to point to compiled JavaScript in dist/
       * Ensures compatibility between local development and production environments.
       */
      expect(pkg.scripts?.start).toBe('node dist/server.js');
      expect(pkg.scripts?.dev).toBe('nodemon server.js');
    });
  });

  /**
   * SECTION 2: VERSION CONTROL SECURITY (VCS Gate)
   * Prevents critical secrets and local junk from reaching the repository.
   */
  describe('Version Control Security Policy', () => {

    test('Security: Must strictly ignore .env files to prevent credential exposure', () => {
      /**
       * RISK MITIGATION: Safeguarding Pi Network API Keys and MongoDB URIs.
       * Mandatory check for all local environment variants.
       */
      expect(gitignoreContent).toMatch(/\.env/);
      expect(gitignoreContent).toMatch(/\.env\.local/);
    });

    test('Architecture: Should exclude node_modules and bulky log files', () => {
      // Keeping the repository lean and preventing dependency version drifts
      expect(gitignoreContent).toMatch(/node_modules\//);
      expect(gitignoreContent).toMatch(/logs\//);
      expect(gitignoreContent).toMatch(/\*\.log/);
    });

    test('Cleanliness: Should ignore IDE-specific metadata (.vscode, .DS_Store)', () => {
      // Preventing configuration pollution across different developer environments
      expect(gitignoreContent).toMatch(/\.vscode\//);
      expect(gitignoreContent).toMatch(/\.DS_Store/);
    });
  });
});
