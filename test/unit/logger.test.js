/**
 * Audit Logger Unit Tests - Spec-Compliant v1.6 (Final Pass)
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Transparency Standard
 * ---------------------------------------------------------
 * PURPOSE: 
 * Validates the Financial Audit Logging Engine. Ensures critical 
 * alerts are captured and the engine adapts to Vercel's environment.
 */

import { jest } from '@jest/globals';

// High-level Spy on console before importing the logger to catch boot messages
const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

// Import after spy to capture the "MapCap Audit Engine Synchronized" log
const { writeAuditLog } = await import('../../src/config/logger.js');

describe('Audit Logger Engine - Unit Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    // We don't restore here to keep the spy active for all tests in this suite
  });

  /**
   * TEST: INFO Level Logging
   * Requirement: Standard operational logs must use the [AUDIT_INFO] prefix.
   */
  test('INFO Logs: Should output formatted informational entries to console', () => {
    const message = "System heartbeat stable.";
    writeAuditLog('INFO', message);
    
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('[AUDIT_INFO]')
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining(message)
    );
  });

  /**
   * TEST: CRITICAL Alert Elevation
   * Requirement: Daniel's Compliance - Security failures must use [AUDIT_ALERT].
   */
  test('CRITICAL Alerts: Should elevate priority for security failures', () => {
    const errorMessage = "A2UaaS Pipeline Breach Detected!";
    writeAuditLog('CRITICAL', errorMessage, 'ALERT'); // Using the correct level mapped in logger.js
    
    // Check if it was routed to console.error with the correct tag
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('[AUDIT_ALERT]')
    );
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining(errorMessage)
    );
  });

  /**
   * TEST: Vercel Environment Adaptation
   * Resolves: "Expected to have been called with" failure.
   */
  test('Environment: Should verify logger synchronization message on boot', () => {
    // Verification of the initialization log captured during import
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('MapCap Audit Engine Synchronized')
    );
  });
});
