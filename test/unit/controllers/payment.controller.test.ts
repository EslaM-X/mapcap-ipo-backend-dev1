/**
 * Payment Operations & Pi Network Integrity - Unified Suite v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Financial Audit Standards
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Implemented Partial<Request/Response> for type-safe Express mocking.
 * - Formalized transaction and investor model spies for audit simulation.
 * - Synchronized Pi Network V2 configuration assertions.
 * - Maintained "Ledger synchronization successful" string for Frontend parity.
 */

import PaymentController from '../../../src/controllers/payment.controller.js';
import PiConfig from '../../../src/config/pi_network.js';
import Transaction from '../../../src/models/Transaction.js';
import Investor from '../../../src/models/investor.model.js';
import { jest } from '@jest/globals';
import { Request, Response } from 'express';

describe('Payment & Pi Network Integration - Unit Tests', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {
      body: {
        piAddress: 'GBV...PIONEER_ADDR',
        amount: 100,
        piTxId: 'TXID_2026_MAPCAP_SYNC'
      }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    // Database Mocking for Daniel's Audit simulation
    jest.spyOn(Transaction, 'findOne').mockResolvedValue(null);
    jest.spyOn(Transaction, 'create').mockResolvedValue({ _id: 'mock_tx_id' } as any);
    jest.spyOn(Investor, 'findOneAndUpdate').mockResolvedValue({ 
      piAddress: 'GBV...PIONEER_ADDR', 
      totalPiContributed: 500 
    } as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  /**
   * SECTION 1: PI NETWORK & ESCROW CONFIGURATION
   */
  describe('Pi Network Infrastructure Constants', () => {
    
    test('API: Should verify Pi Network V2 and EscrowPi A2UaaS base endpoints', () => {
      expect(PiConfig.api.baseUrl).toBe("https://api.minepi.com/v2");
      expect(PiConfig.escrow.payoutEndpoint).toBe("/payouts/a2uaas");
    });

    test('Financials: Should enforce the mandatory 0.01 Pi network gas fee', () => {
      expect(PiConfig.constants.txFee).toBe(0.01);
    });

    test('Security: Pi configuration object must be frozen to prevent tampering', () => {
      // Compliance: Preventing runtime modification of sensitive API keys or endpoints
      expect(Object.isFrozen(PiConfig)).toBe(true);
    });
  });

  /**
   * SECTION 2: INVESTMENT CONTROLLER LOGIC
   */
  describe('Investment Processing & Idempotency', () => {

    /**
     * Success Logic: Ensures atomic updates to both Transactions and Investor records.
     */
    test('Success: Should process new investment and return 200 to the Frontend', async () => {
      await PaymentController.processInvestment(mockReq as Request, mockRes as Response);

      expect(Transaction.create).toHaveBeenCalled();
      expect(Investor.findOneAndUpdate).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ 
          success: true, 
          message: "Ledger synchronization successful." 
        })
      );
    });

    /**
     * Anti-Duplicate Security: Crucial for financial integrity.
     */
    test('Security: Should block duplicate transactions (Idempotency Guard)', async () => {
      jest.spyOn(Transaction, 'findOne').mockResolvedValue({ piTxId: 'TXID_2026_MAPCAP_SYNC' } as any);

      await PaymentController.processInvestment(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      const lastCall = (mockRes.json as jest.Mock).mock.calls[0][0];
      expect(lastCall.message).toContain("Duplicate Entry");
    });

    /**
     * Validation Gate: Blocks requests missing mandatory blockchain metadata.
     */
    test('Validation: Should reject requests with missing financial metadata', async () => {
      mockReq.body = { piAddress: 'GBV...ADDR' };

      await PaymentController.processInvestment(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });
});

