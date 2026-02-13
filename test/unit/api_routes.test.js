/**
 * API Routes Unit Tests - Communication Layer v1.7
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's White-Label Strategy
 * * PURPOSE:
 * Validates the Unified API entry points.
 * Ensures the Global Pulse and Payout Pipeline respond 
 * correctly to standardized requests.
 * ---------------------------------------------------------
 */

import router from '../../src/routes/api.js';
import PriceService from '../../src/services/price.service.js';
import PayoutService from '../../src/services/payout.service.js';
import { jest } from '@jest/globals';

describe('Unified API Routes - Integration Point Tests', () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  /**
   * TEST: Global Stats Sync
   * Requirement: Should return accurate price and supply metrics.
   */
  test('Pulse: GET /stats should deliver synchronized scarcity engine metrics', async () => {
    const mockReq = {};
    
    // PriceService.calculateDailySpotPrice will return a price based on our mock logic
    const result = await router.stack.find(s => s.route?.path === '/stats').route.stack[0].handle(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    const responseData = mockRes.json.mock.calls[0][0];
    
    expect(responseData.data).toHaveProperty('spotPrice');
    expect(responseData.data.compliance.whaleShield).toBe('Active');
  });

  /**
   * TEST: Secure Payout Initiation
   * Requirement: Should trigger PayoutService for A2UaaS operations.
   */
  test('A2UaaS: POST /withdraw should initiate the payout sequence for valid data', async () => {
    const mockReq = {
      body: { userWallet: 'GBV...ADDR', amount: 500 }
    };

    // Mocking the PayoutService to return success
    jest.spyOn(PayoutService, 'executeA2UPayout').mockResolvedValue({ txId: 'pi_tx_123' });

    const routeHandler = router.stack.find(s => s.route?.path === '/withdraw').route.stack[0].handle;
    await routeHandler(mockReq, mockRes);

    expect(PayoutService.executeA2UPayout).toHaveBeenCalledWith('GBV...ADDR', 500);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ 
        message: expect.stringContaining("Initiated") 
    }));
  });

  /**
   * TEST: Missing Parameters Security
   * Requirement: Pipeline must reject requests with missing wallet/amount.
   */
  test('Security: POST /withdraw should reject requests with missing parameters', async () => {
    const mockReq = { body: { amount: 500 } }; // Missing wallet

    const routeHandler = router.stack.find(s => s.route?.path === '/withdraw').route.stack[0].handle;
    await routeHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(PayoutService.executeA2UPayout).not.toHaveBeenCalled();
  });
});

