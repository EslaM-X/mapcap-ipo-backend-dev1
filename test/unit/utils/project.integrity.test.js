/**
 * MISSION-CRITICAL: PROJECT INTEGRITY & SECURITY ENFORCEMENT
 * -------------------------------------------------------------------------
 * LEAD ARCHITECT: EslaM-X | AppDev @Map-of-Pi
 * VERSION: 1.7.5 (Synchronized)
 * SECURITY COMPLIANCE: Daniel's Node.js Standard & Pi Network Ecosystem Spec
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
   */
  describe('Dependency & Metadata Guard', () => {

    test('Metadata: Should align with stabilized v1.7.x and ESM standards', () => {
      // UPDATED: Syncing with current project version to prevent CI/CD failure
      expect(pkg.name).toBe('mapcap-ipo-backend');
      expect(pkg.version).toBe('1.7.0'); // Matches the updated Project Version
      expect(pkg.type).toBe('module');  
    });

    test('Runtime: Must enforce Node.js >=18.0.0 for Top-level Await support', () => {
      expect(pkg.engines.node).toBe('>=18.0.0');
    });

    test('Stack: Should verify presence of Core Financial & Security libraries', () => {
      const deps = pkg.dependencies;
      const coreStack = ['helmet', 'mongoose', 'node-cron', 'jsonwebtoken', 'dotenv'];
      
      coreStack.forEach(dep => {
        expect(deps).toHaveProperty(dep);
      });
    });

    test('Scripts: Should define standardized Start/Dev entry points for Vercel', () => {
      expect(pkg.scripts.start).toBe('node server.js');
      expect(pkg.scripts.dev).toBe('nodemon server.js');
    });
  });

  /**
   * SECTION 2: VERSION CONTROL SECURITY (VCS Gate)
   */
  describe('Version Control Security Policy', () => {

    test('Security: Must strictly ignore .env files to prevent credential exposure', () => {
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
