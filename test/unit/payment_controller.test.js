/**
 * Payment Controller Unit Tests - Financial Operations v1.6
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Financial Audit Standards
 * * PURPOSE:
 * Validates the Investment Processing Pipeline.
 * Ensures strict idempotency (anti-duplicate) and accurate 
 * ledger synchronization for Pioneer contributions.
 * ---------------------------------------------------------
 */

import PaymentController from '../../src/controllers/payment.controller.js';
import Transaction from '../../src/models/transaction.model.js';
import Investor from '../../src/models/investor.model.js';
import { jest } from '@jest/globals';

describe('Payment Controller - Investment Logic Tests', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      body: {
        piAddress: 'GBV...PIONEER_ADDR',
        amount: 100,
        piTxId: 'TXID_9988776655'
      }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Spying on DB Models
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
   * TEST: Successful Investment Processing
   * Verifies that a valid payment updates the ledger and returns 200.
   */
  test('Success: Should process new investment and update investor balance', async () => {
    await PaymentController.processInvestment(mockReq, mockRes);

    expect(Transaction.create).toHaveBeenCalled();
    expect(Investor.findOneAndUpdate).toHaveBeenCalled();
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, message: "Ledger Synchronized Successfully." })
    );
  });

  /**
   * TEST: Idempotency (Duplicate Prevention)
   * Ensures that the same TXID cannot be processed twice (Spec Requirement).
   */
  test('Security: Should block duplicate transactions (Idempotency Check)', async () => {
    // Mocking that the transaction already exists
    jest.spyOn(Transaction, 'findOne').mockResolvedValue({ piTxId: 'TXID_9988776655' });

    await PaymentController.processInvestment(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(409);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining("Duplicate Transaction") })
    );
  });

  /**
   * TEST: Validation Safety
   * Ensures the controller rejects requests with missing metadata.
   */
  test('Validation: Should return 400 if metadata is missing', async () => {
    mockReq.body = { piAddress: 'GBV...ADDR' }; // Missing amount and txId

    await PaymentController.processInvestment(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });
});

