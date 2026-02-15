/**
 * Project Integrity & Security Policy - Unified Suite v1.7.0
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Security & Node.js Compliance
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * This suite acts as the "Pre-flight Check" for the MapCap ecosystem.
 * It validates:
 * 1. Package Integrity: Versioning, Engines, and Critical Financial Stack.
 * 2. Gitignore Policy: Preventing credential leaks (.env) and repo bloat.
 * -------------------------------------------------------------------------
 */

import fs from 'fs';
import path from 'path';

describe('Project Integrity - Architecture & Security Policy', () => {
  const packagePath = path.resolve(process.cwd(), 'package.json');
  const gitignorePath = path.resolve(process.cwd(), '.gitignore');
  
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');

  /**
   * SECTION 1: PACKAGE.JSON INTEGRITY
   * Requirement: Node.js 18+ and ES6 Module support for financial precision.
   *
   */
  describe('Dependency & Metadata Guard', () => {

    test('Metadata: Should align with stabilized v1.6.2 and ESM standards', () => {
      expect(pkg.name).toBe('mapcap-ipo-backend');
      expect(pkg.version).toBe('1.6.2');
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
   * SECTION 2: GITIGNORE POLICY (Security Gate)
   * Requirement: Daniel's Security Spec - Prevent credential leakage and metadata bloat.
   *
   */
  describe('Version Control Security Policy', () => {

    test('Security: Must strictly ignore .env files to prevent credential exposure', () => {
      expect(gitignoreContent).toMatch(/^\.env$/m);
      expect(gitignoreContent).toMatch(/^\.env\.local$/m);
    });

    test('Architecture: Should exclude node_modules and bulky log files', () => {
      expect(gitignoreContent).toMatch(/^node_modules\/$/m);
      expect(gitignoreContent).toMatch(/^logs\/$/m);
      expect(gitignoreContent).toMatch(/^\*\.log$/m);
    });

    test('Cleanliness: Should ignore IDE-specific metadata (.vscode, .DS_Store)', () => {
      expect(gitignoreContent).toMatch(/^\.vscode\/$/m);
      expect(gitignoreContent).toMatch(/^\.DS_Store$/m);
    });
  });
});

