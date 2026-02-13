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
   * Fix: Aligned with the new 'path' and 'timestamp' properties in server.js.
   * Resolves: "Expected path: 'success' | Received path: []" failure.
   */
  test('Heartbeat: GET / should return 200 and operational live metrics', async () => {
    // Mocking the aggregate result to simulate DB response
    const aggregateSpy = jest.spyOn(Investor, 'aggregate').mockResolvedValue([{
      totalPiInPool: 1000000,
      pioneerCount: 500
    }]);

    const res = await request(app).get('/');

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    
    /**
     * COMPLIANCE CHECK: 
     * Verifying the 'path' property which is critical for the Heartbeat Monitor.
     */
    expect(res.body).toHaveProperty('path', 'success'); 
    expect(res.body).toHaveProperty('timestamp');
    
    // Validating Philip's required metrics from the 'data' object
    expect(res.body.data.live_metrics.total_investors).toBe(500);
    expect(res.body.data.live_metrics.total_pi_invested).toBe(1000000);
    
    aggregateSpy.mockRestore();
  });

  /**
   * TEST: CORS & Security Headers
   * Requirement: Public API accessibility for the MapCap Dashboard.
   */
  test('Security: Should have CORS headers enabled for dashboard access', async () => {
    const res = await request(app).get('/'); // GET request also carries CORS headers
    expect(res.header['access-control-allow-origin']).toBe('*');
  });

  /**
   * TEST: Error Handling Interceptor
   * Requirement: Global interceptor should catch and format 404/500 errors.
   */
  test('Resilience: Should trigger the Global Error Interceptor on failures', async () => {
    // Requesting a non-existent endpoint to trigger the error flow
    const res = await request(app).get('/api/v1/non-existent-endpoint');
    
    /**
     * Standardized Error Response Validation.
     * Ensures the Frontend receives a consistent JSON object even on crashes.
     */
    expect(res.body).toHaveProperty('success');
    expect(res.body.success).toBe(false); // Errors should return success: false
  });
});
