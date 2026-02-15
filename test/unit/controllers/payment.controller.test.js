/**
 * Payment Operations & Pi Network Integrity - Unified Suite v1.7.5
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Financial Audit Standards
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * This suite validates the Investment Processing Pipeline and its underlying 
 * Pi Network configuration. It ensures strict idempotency (anti-duplicate) 
 * for transactions and validates the immutable constants required for 
 * secure A2UaaS (App-to-User) operations.
 * -------------------------------------------------------------------------
 */

import PaymentController from '../../../src/controllers/payment.controller.js';
import PiConfig from '../../../src/config/pi_network.js';
import Transaction from '../../../src/models/Transaction.js';
import Investor from '../../../src/models/investor.model.js';
import { jest } from '@jest/globals';

describe('Payment & Pi Network Integration - Unit Tests', () => {
  let mockReq, mockRes;

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
      json: jest.fn()
    };

    // Database Mocking for Daniel's Audit simulation
    jest.spyOn(Transaction, 'findOne').mockResolvedValue(null);
    jest.spyOn(Transaction, 'create').mockResolvedValue({ _id: 'mock_tx_id' });
    jest.spyOn(Investor, 'findOneAndUpdate').mockResolvedValue({ 
      piAddress: 'GBV...PIONEER_ADDR', 
      totalPiContributed: 500 
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * SECTION 1: PI NETWORK & ESCROW CONFIGURATION
   * Requirement: Validates the communication layer constants to ensure
   * the Frontend/Backend handshake with Pi Network V2 is immutable.
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
      // Daniel's Requirement: Prevents runtime modification of API keys or URLs.
      expect(Object.isFrozen(PiConfig)).toBe(true);
    });
  });

  /**
   * SECTION 2: INVESTMENT CONTROLLER LOGIC
   * Requirement: Processes incoming payments and ensures the Ledger is synchronized.
   * Maintains Philip's "Water-Level" accuracy on the Pulse Dashboard.
   */
  describe('Investment Processing & Idempotency', () => {

    /**
     * Requirement: Successful investment must update both Transaction and Investor models.
     */
    test('Success: Should process new investment and return 200 to the Frontend', async () => {
      await PaymentController.processInvestment(mockReq, mockRes);

      expect(Transaction.create).toHaveBeenCalled();
      expect(Investor.findOneAndUpdate).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ 
          success: true, 
          message: "Ledger Synchronized Successfully." 
        })
      );
    });

    /**
     * Requirement: Anti-Duplicate Security (Daniel's Specification).
     * Prevents processing the same blockchain hash (piTxId) twice.
     */
    test('Security: Should block duplicate transactions (Idempotency Guard)', async () => {
      // Simulating an existing transaction in the audit ledger
      jest.spyOn(Transaction, 'findOne').mockResolvedValue({ piTxId: 'TXID_2026_MAPCAP_SYNC' });

      await PaymentController.processInvestment(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining("Duplicate Transaction") })
      );
    });

    /**
     * Requirement: Sanitization - Prevents malformed requests from reaching the Database.
     */
    test('Validation: Should reject requests with missing financial metadata', async () => {
      mockReq.body = { piAddress: 'GBV...ADDR' }; // Missing amount and txId

      await PaymentController.processInvestment(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });
});

