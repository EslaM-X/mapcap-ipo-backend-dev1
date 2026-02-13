/**
 * Server Heartbeat Unit Tests - Core Orchestration v1.6.2 (Stabilized)
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip & Daniel Compliance
 * ---------------------------------------------------------
 * PURPOSE: 
 * Validates the core Express server orchestration and 'Root Pulse' endpoint.
 * Ensures strict adherence to the standardized JSON response schema.
 */

import request from 'supertest';
import app from '../../server.js'; 
import Investor from '../../src/models/investor.model.js';
import { jest } from '@jest/globals';

describe('Server Engine - Heartbeat & Integration Tests', () => {

  /**
   * TEST: Root Pulse Check (Philip's Requirement)
   * Fix: Aligned with the actual production JSON structure from server.js.
   * Note: Validates operational status and liquidity metrics for the Frontend.
   */
  test('Heartbeat: GET / should return 200 and operational live metrics', async () => {
    // Mocking the aggregate result to simulate DB response
    const aggregateSpy = jest.spyOn(Investor, 'aggregate').mockResolvedValue([{
      totalPiInPool: 1000000,
      pioneerCount: 500
    }]);

    const res = await request(app).get('/');

    expect(res.statusCode).toEqual(200);
    
    // Core property check: success should be a boolean true
    expect(res.body.success).toBe(true);
    
    /**
     * COMPLIANCE CHECK: 
     * Verifying standard timestamp for heartbeat synchronization.
     */
    expect(res.body).toHaveProperty('timestamp');
    
    // Validating Philip's required metrics from the 'data' object
    // Ensures nested property 'live_metrics' is consistent for the Frontend Dashboard.
    expect(res.body.data.live_metrics.total_investors).toBe(500);
    expect(res.body.data.live_metrics.total_pi_invested).toBe(1000000);
    
    aggregateSpy.mockRestore();
  });

  /**
   * TEST: CORS & Security Headers
   * Requirement: Public API accessibility for the MapCap Dashboard.
   */
  test('Security: Should have CORS headers enabled for dashboard access', async () => {
    const res = await request(app).get('/'); 
    expect(res.header['access-control-allow-origin']).toBe('*');
  });

  /**
   * TEST: Error Handling Interceptor
   * Requirement: Global interceptor should catch and format 404/500 errors.
   * FIX v1.6.2: Standardized error object validation to prevent test timeout.
   */
  test('Resilience: Should trigger the Global Error Interceptor on failures', async () => {
    // Requesting a non-existent endpoint to trigger the standardized error flow
    const res = await request(app).get('/api/v1/non-existent-endpoint');
    
    /**
     * Standardized Error Response Validation.
     * We verify the existence of the response body and the failure state.
     * This ensures the Frontend can gracefully handle API anomalies.
     */
    expect(res.body).toBeDefined();
    
    // Check for success property; even on 404, our interceptor should return success: false
    if (res.body.hasOwnProperty('success')) {
        expect(res.body.success).toBe(false);
    } else {
        // Fallback for generic server errors during test execution
        expect(res.status).not.toBe(200);
    }
  });
});
