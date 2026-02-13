/**
 * Whale Refund Job Unit Tests - Anti-Whale Enforcement v1.5
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel
 * * PURPOSE:
 * Validates the 10% ceiling enforcement protocol.
 * Ensures excess Pi is calculated accurately and returned 
 * via the A2UaaS protocol as per Spec Page 5.
 * ---------------------------------------------------------
 */

import { runWhaleRefunds } from '../../src/jobs/refunds.job.js';
import PaymentService from '../../src/services/payment.service.js';
import { jest } from '@jest/globals';

describe('Whale Refund Job - Enforcement Logic Tests', () => {
  
  beforeEach(() => {
    // Mocking PaymentService to prevent real blockchain transactions
    jest.spyOn(PaymentService, 'transferPi').mockResolvedValue({ success: true });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * TEST: Excess Calculation & Refund Trigger
   * Requirement: Any contribution > 10% of pool must be refunded.
   */
  test('Enforcement: Should identify whales and refund only the excess amount', async () => {
    const totalPiPool = 100000;
    const WHALE_CAP = 10000; // 10% of 100,000

    const mockInvestors = [
      { 
        piAddress: 'Whale_User', 
        totalPiContributed: 15000, // 5,000 excess
        save: jest.fn().mockResolvedValue(true) 
      },
      { 
        piAddress: 'Normal_User', 
        totalPiContributed: 5000, // Within cap
        save: jest.fn().mockResolvedValue(true) 
      }
    ];

    const result = await runWhaleRefunds(totalPiPool, mockInvestors);

    // Assertions
    expect(result.refundCount).toBe(1);
    expect(result.totalRefundedPi).toBe(5000);
    expect(PaymentService.transferPi).toHaveBeenCalledWith('Whale_User', 5000);
    expect(PaymentService.transferPi).not.toHaveBeenCalledWith('Normal_User', expect.anything());
  });

  /**
   * TEST: Model Update (Flagging)
   * Requirement: Investors must be marked as isWhale = true after refund.
   */
  test('Audit: Should update investor model with isWhale flag and capped balance', async () => {
    const mockWhale = { 
        piAddress: 'Whale_User', 
        totalPiContributed: 20000, 
        save: jest.fn().mockResolvedValue(true) 
    };

    await runWhaleRefunds(100000, [mockWhale]);

    expect(mockWhale.isWhale).toBe(true);
    expect(mockWhale.totalPiContributed).toBe(10000); // Capped at 10%
    expect(mockWhale.save).toHaveBeenCalled();
  });

  /**
   * TEST: Pipeline Fault Tolerance
   * Requirement: Failed refunds must not stop the entire loop.
   */
  test('Resilience: Should continue processing if one refund transfer fails', async () => {
    jest.spyOn(PaymentService, 'transferPi')
        .mockRejectedValueOnce(new Error('Network Lag'))
        .mockResolvedValue({ success: true });

    const mockInvestors = [
      { piAddress: 'Whale_1', totalPiContributed: 20000, save: jest.fn() },
      { piAddress: 'Whale_2', totalPiContributed: 30000, save: jest.fn() }
    ];

    const result = await runWhaleRefunds(100000, mockInvestors);

    // Should still try to process Whale_2 even if Whale_1 fails
    expect(PaymentService.transferPi).toHaveBeenCalledTimes(2);
  });
});

