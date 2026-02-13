/**
 * Audit Logger Unit Tests - Spec-Compliant v1.6.2 (Final Pass)
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Transparency Standard
 * ---------------------------------------------------------
 * ARCHITECTURAL PURPOSE: 
 * Validates the Financial Audit Logging Engine. Ensures critical 
 * alerts are captured and the engine adapts to Vercel's environment.
 * * FIX LOG v1.6.2:
 * Modified the boot synchronization test to use flexible string matching.
 * This accounts for ANSI color codes and timestamps injected by the logger.
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
    writeAuditLog('CRITICAL', errorMessage); 
    
    // Check if it was routed to console.error with the correct alert tag
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('[AUDIT_ALERT]')
    );
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining(errorMessage)
    );
  });

  /**
   * TEST: Vercel Environment Adaptation
   * Fix: Using flexible matching to bypass ANSI colors and dynamic timestamps.
   * Requirement: Philip's Dashboard 'Water-Level' Visualizer initialization.
   */
  test('Environment: Should verify logger synchronization message on boot', () => {
    /**
     * The logger emits a sync message upon initialization.
     * We use stringContaining to ignore color codes like \x1b[32m
     */
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Audit Engine Synchronized')
    );
  });
});
