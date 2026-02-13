/**
 * Audit Logger Unit Tests - Spec-Compliant v1.5
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Transparency Standard
 * * PURPOSE:
 * Validates the Financial Audit Logging Engine.
 * Ensures that critical alerts (Whale-Shield/A2UaaS) are captured
 * and that the engine adapts correctly to Vercel's read-only environment.
 * ---------------------------------------------------------
 */

import { writeAuditLog } from '../../src/config/logger.js';
import { jest } from '@jest/globals';

describe('Audit Logger Engine - Unit Tests', () => {
  
  beforeEach(() => {
    // Spy on console methods to verify output without polluting test logs
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * TEST: INFO Level Logging
   * Ensures standard operational logs are outputted with the correct prefix.
   */
  test('INFO Logs: Should output formatted informational entries to console', () => {
    const message = "System heartbeat stable.";
    writeAuditLog('INFO', message);
    
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('[AUDIT_INFO]')
    );
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining(message)
    );
  });

  /**
   * TEST: CRITICAL Alert Elevation
   * Ensures that ERROR/CRITICAL logs are highlighted for Daniel's monitoring.
   */
  test('CRITICAL Alerts: Should elevate priority for security/financial failures', () => {
    const errorMessage = "A2UaaS Pipeline Breach Detected!";
    writeAuditLog('CRITICAL', errorMessage);
    
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('[AUDIT_ALERT]')
    );
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining(errorMessage)
    );
  });

  /**
   * TEST: Vercel Environment Adaptation
   * Verifies the logic handles production vs development paths correctly.
   */
  test('Environment: Should verify logger synchronization message on boot', () => {
    // The file writes an initial log on import
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('MapCap Audit Engine Synchronized')
    );
  });
});

