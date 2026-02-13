/**
 * Package Integrity Unit Tests - Dependency Guard v1.6.1
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Node.js Runtime Compliance
 * * PURPOSE:
 * Validates the project configuration and engine requirements.
 * Ensures all critical security dependencies (Helmet, JWT) and 
 * financial tools (Mongoose, Cron) are defined for production.
 * ---------------------------------------------------------
 */

import fs from 'fs';
import path from 'path';

describe('Package Integrity - Production Readiness Tests', () => {
  const packagePath = path.resolve(process.cwd(), 'package.json');
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

  /**
   * TEST: Versioning & Metadata
   * Requirement: Version must match the stabilized release 1.6.1.
   */
  test('Metadata: Should have the correct name and stabilized version', () => {
    expect(pkg.name).toBe('mapcap-ipo-backend');
    expect(pkg.version).toBe('1.6.1');
    expect(pkg.type).toBe('module'); // Critical for ES6 imports
  });

  /**
   * TEST: Engine Compatibility
   * Requirement: Node.js version must be 18+ for Top-level Await support.
   */
  test('Runtime: Should require Node.js version 18 or higher', () => {
    expect(pkg.engines.node).toBe('>=18.0.0');
  });

  /**
   * TEST: Critical Security & Financial Stack
   * Requirement: Essential libraries must be present.
   */
  test('Dependencies: Should include all core security and financial libraries', () => {
    const deps = pkg.dependencies;
    expect(deps).toHaveProperty('helmet');      // Security headers
    expect(deps).toHaveProperty('mongoose');    // DB Ledger
    expect(deps).toHaveProperty('node-cron');   // Automation (Vesting/Dividends)
    expect(deps).toHaveProperty('jsonwebtoken'); // Admin Auth
    expect(deps).toHaveProperty('dotenv');      // Env Protection
  });

  /**
   * TEST: Script Definitions
   * Requirement: Standard start and dev scripts for Vercel/Local dev.
   */
  test('Scripts: Should define start and development entry points', () => {
    expect(pkg.scripts.start).toBe('node server.js');
    expect(pkg.scripts.dev).toBe('nodemon server.js');
  });
});

