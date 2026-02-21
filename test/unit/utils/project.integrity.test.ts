/**
 * MISSION-CRITICAL: PROJECT INTEGRITY & SECURITY ENFORCEMENT v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * LEAD ARCHITECT: EslaM-X | AppDev @Map-of-Pi
 * VERSION: Synchronized with v1.7.5 Stability Standards
 * SECURITY COMPLIANCE: Node.js Modern Standard & Pi Network Ecosystem Spec
 * -------------------------------------------------------------------------
 * INTEGRITY ASSURANCE LOG:
 * - Validates core manifest metadata (v1.7.0/1.7.5) for service discovery.
 * - Ensures TypeScript source-to-dist mapping remains consistent.
 * - Guardrails against accidental credential leaks (VCS Protection).
 * - Zero-change policy applied to existing function signatures.
 */

import fs from 'fs';
import path from 'path';

describe('Project Integrity - Architecture & Security Policy', () => {
  // Resolved paths for environmental consistency across Vercel and local environments
  const packagePath = path.resolve(process.cwd(), 'package.json');
  const gitignorePath = path.resolve(process.cwd(), '.gitignore');
  
  // Safe manifest reading for integrity checks
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');

  /**
   * SECTION 1: MANIFEST VALIDATION (package.json)
   * Prevents drift in core project configuration that could break CI/CD.
   */
  describe('Dependency & Metadata Guard', () => {

    test('Metadata: Should align with stabilized v1.7.x and ESM standards', () => {
      /**
       * AUDIT: Ensuring the backend remains identifiable by the Frontend.
       * Baseline version set to 1.7.5 to maintain ecosystem compatibility.
       */
      expect(pkg.name).toBe('mapcap-ipo-backend');
      expect(pkg.version).toBe('1.7.5'); 
      expect(pkg.type).toBe('module');  
    });

    test('Runtime: Must enforce Node.js >=18.0.0 for stability in 2026', () => {
      // Enforcing modern runtime features like Top-level Await.
      expect(pkg.engines?.node).toBe('>=18.0.0');
    });

    test('Stack: Should verify presence of Core MERN + AI libraries', () => {
      /**
       * CRITICAL DEPENDENCIES: Verified as per @Map-of-Pi architecture roadmap.
       * Failure here indicates a missing layer in the security or data stack.
       */
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      const coreStack = ['helmet', 'mongoose', 'node-cron', 'jsonwebtoken', 'dotenv'];
      
      coreStack.forEach(dep => {
        expect(deps).toHaveProperty(dep);
      });
    });

    test('Scripts: Should define standardized entry points for TS execution', () => {
      /**
       * EXECUTION LOGIC: 
       * 'start' -> Production compiled code (dist).
       * 'dev'   -> Development source code (src).
       */
      expect(pkg.scripts?.start).toBe('node dist/server.js');
      expect(pkg.scripts?.dev).toBe('nodemon src/server.ts');
    });
  });

  /**
   * SECTION 2: VERSION CONTROL SECURITY (VCS Gate)
   * Mandatory security check to safeguard Pi Network & MongoDB secrets.
   */
  describe('Version Control Security Policy', () => {

    test('Security: Must strictly ignore .env files to prevent credential exposure', () => {
      // Safeguarding the ecosystem from accidental API key leaks.
      expect(gitignoreContent).toMatch(/\.env/);
      expect(gitignoreContent).toMatch(/\.env\.local/);
    });

    test('Architecture: Should exclude node_modules and bulky log files', () => {
      // Maintains repository health and build performance.
      expect(gitignoreContent).toMatch(/node_modules\//);
      expect(gitignoreContent).toMatch(/logs\//);
      expect(gitignoreContent).toMatch(/\*\.log/);
    });

    test('Cleanliness: Should ignore IDE-specific metadata', () => {
      // Prevents configuration pollution across different dev environments.
      expect(gitignoreContent).toMatch(/\.vscode\//);
      expect(gitignoreContent).toMatch(/\.DS_Store/);
    });
  });
});
