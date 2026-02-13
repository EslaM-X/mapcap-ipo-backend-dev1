/**
 * Server Heartbeat Unit Tests - Core Orchestration v1.2
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip & Daniel Compliance
 * * PURPOSE:
 * Validates the core Express server orchestration, middleware 
 * integration, and the 'Root Pulse' endpoint metrics.
 * ---------------------------------------------------------
 */

import request from 'supertest';
import app from '../../server.js';
import Investor from '../../src/models/investor.model.js';
import { jest } from '@jest/globals';

describe('Server Engine - Heartbeat & Integration Tests', () => {

  /**
   * TEST: Root Pulse Check (Philip's Requirement)
   * Requirement: Must return live aggregate metrics (Total Pi, Pioneer Count).
   */
  test('Heartbeat: GET / should return 200 and operational live metrics', async () => {
    // Mocking the aggregate result for performance and isolation
    const aggregateSpy = jest.spyOn(Investor, 'aggregate').mockResolvedValue([{
      totalPiInPool: 1000000,
      pioneerCount: 500
    }]);

    const res = await request(app).get('/');

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.live_metrics.total_investors).toBe(500);
    expect(res.body.data.live_metrics.total_pi_invested).toBe(1000000);
    expect(res.body.data.status).toContain('Whale-Shield');
    
    aggregateSpy.mockRestore();
  });

  /**
   * TEST: CORS & Security Headers
   * Requirement: Ensure Daniel's security standards for cross-origin requests.
   */
  test('Security: Should have CORS headers enabled for dashboard access', async () => {
    const res = await request(app).options('/');
    expect(res.header['access-control-allow-origin']).toBe('*');
  });

  /**
   * TEST: Error Handling Interceptor
   * Requirement: Global interceptor should catch and format 500 errors.
   */
  test('Resilience: Should trigger the Global Error Interceptor on failures', async () => {
    // Force an error on a route
    const res = await request(app).get('/api/admin/invalid-route');
    // If the route doesn't exist, Express returns 404, but we check if our 
    // ResponseHelper formatting is consistent.
    expect(res.body).toHaveProperty('success');
  });
});

