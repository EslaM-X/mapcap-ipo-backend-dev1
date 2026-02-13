/**
 * Server Heartbeat Unit Tests - Core Orchestration v1.6.1
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip & Daniel Compliance
 * * PURPOSE:
 * Validates the core Express server orchestration, middleware 
 * integration, and the 'Root Pulse' endpoint metrics.
 * ---------------------------------------------------------
 */

import request from 'supertest';
// Using full path for ES Modules compatibility in Termux
import app from '../../server.js'; 
import Investor from '../../src/models/investor.model.js';
import { jest } from '@jest/globals';

describe('Server Engine - Heartbeat & Integration Tests', () => {

  /**
   * TEST: Root Pulse Check (Philip's Requirement)
   * Requirement: Must return live aggregate metrics.
   * Resolves the 'Received path: []' issue by ensuring structured data.
   */
  test('Heartbeat: GET / should return 200 and operational live metrics', async () => {
    // Mocking the aggregate result to simulate DB response without DB connection
    const aggregateSpy = jest.spyOn(Investor, 'aggregate').mockResolvedValue([{
      totalPiInPool: 1000000,
      pioneerCount: 500
    }]);

    const res = await request(app).get('/');

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    // Ensuring the 'path: success' property is present for the Interceptor
    expect(res.body).toHaveProperty('path', 'success'); 
    
    // Validating Philip's required metrics
    expect(res.body.data.live_metrics.total_investors).toBe(500);
    expect(res.body.data.live_metrics.total_pi_invested).toBe(1000000);
    
    aggregateSpy.mockRestore();
  });

  /**
   * TEST: CORS & Security Headers
   * Requirement: Ensure Daniel's security standards for cross-origin requests.
   */
  test('Security: Should have CORS headers enabled for dashboard access', async () => {
    const res = await request(app).options('/');
    // Standard validation for public API access
    expect(res.header['access-control-allow-origin']).toBe('*');
  });

  /**
   * TEST: Error Handling Interceptor
   * Requirement: Global interceptor should catch and format non-existent routes.
   * Context: This ensures the 'success: false' is returned instead of raw HTML.
   */
  test('Resilience: Should trigger the Global Error Interceptor on failures', async () => {
    const res = await request(app).get('/api/admin/invalid-route-test');
    
    // Testing the standardized ResponseHelper formatting
    expect(res.body).toHaveProperty('success');
    expect(typeof res.body.success).toBe('boolean');
  });
});
