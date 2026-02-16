/**
 * MISSION-CRITICAL: PROJECT INTEGRITY & SECURITY ENFORCEMENT
 * -------------------------------------------------------------------------
 * LEAD ARCHITECT: EslaM-X | AppDev @Map-of-Pi
 * VERSION: 1.7.0 (Stable)
 * SECURITY COMPLIANCE: Daniel's Node.js Standard & Pi Network Ecosystem Spec
 * -------------------------------------------------------------------------
 * ARCHITECTURAL OVERVIEW:
 * This automated suite serves as a high-level gatekeeper to ensure that the 
 * codebase adheres to strictly defined financial and security standards. 
 * Any failure in this suite indicates a violation of core system architecture.
 * -------------------------------------------------------------------------
 */

import fs from 'fs';
import path from 'path';

describe('Project Integrity - Architecture & Security Policy', () => {
  // Resolved paths to core configuration files to ensure environmental consistency
  const packagePath = path.resolve(process.cwd(), 'package.json');
  const gitignorePath = path.resolve(process.cwd(), '.gitignore');
  
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');

  /**
   * SECTION 1: MANIFEST VALIDATION (package.json)
   * Ensures that the runtime environment and dependencies are locked to 
   * industry-standard versions for Web3/Financial applications.
   */
  describe('Dependency & Metadata Guard', () => {

    test('Metadata: Should align with stabilized v1.6.5 and ESM standards', () => {
      // Validating semantic versioning and module-type to prevent breaking changes in the build pipeline
      expect(pkg.name).toBe('mapcap-ipo-backend');
      expect(pkg.version).toBe('1.6.5'); // Syncing with current production-ready version
      expect(pkg.type).toBe('module');  // Enforcing ECMAScript Modules (ESM)
    });

    test('Runtime: Must enforce Node.js >=18.0.0 for Top-level Await support', () => {
      // Financial precision requires modern Node.js engines for stable async execution
      expect(pkg.engines.node).toBe('>=18.0.0');
    });

    test('Stack: Should verify presence of Core Financial & Security libraries', () => {
      // Verifying the presence of the critical security layer and DB abstraction
      const deps = pkg.dependencies;
      const coreStack = ['helmet', 'mongoose', 'node-cron', 'jsonwebtoken', 'dotenv'];
      
      coreStack.forEach(dep => {
        expect(deps).toHaveProperty(dep);
      });
    });

    test('Scripts: Should define standardized Start/Dev entry points for Vercel', () => {
      // Ensuring deployment scripts are uniform for CI/CD and cloud hosting stability
      expect(pkg.scripts.start).toBe('node server.js');
      expect(pkg.scripts.dev).toBe('nodemon server.js');
    });
  });

  /**
   * SECTION 2: VERSION CONTROL SECURITY (VCS Gate)
   * Prevents critical security leaks such as private keys, environment variables, 
   * or bulky artifacts from being committed to the central repository.
   */
  describe('Version Control Security Policy', () => {

    test('Security: Must strictly ignore .env files to prevent credential exposure', () => {
      // High-priority check: Ensuring secrets are never exposed to the public/private cloud
      expect(gitignoreContent).toMatch(/\.env/);
      expect(gitignoreContent).toMatch(/\.env\.local/);
    });

    test('Architecture: Should exclude node_modules and bulky log files', () => {
      // Optimizing repository size and preventing redundant data transfers
      expect(gitignoreContent).toMatch(/node_modules\//);
      expect(gitignoreContent).toMatch(/logs\//);
      expect(gitignoreContent).toMatch(/\*\.log/);
    });

    test('Cleanliness: Should ignore IDE-specific metadata (.vscode, .DS_Store)', () => {
      // Maintaining a clean development environment across different Operating Systems
      expect(gitignoreContent).toMatch(/\.vscode\//);
      expect(gitignoreContent).toMatch(/\.DS_Store/);
    });
  });
});
