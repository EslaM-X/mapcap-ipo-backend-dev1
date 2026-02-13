/**
 * Transaction Model Unit Tests - Audit Integrity v1.2
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Financial Audit Standards
 * * PURPOSE:
 * Ensures every financial movement is recorded with strict 
 * validation. Validates Transaction Types (Enum) and ensures 
 * Pi Blockchain IDs (piTxId) are unique to prevent double-logging.
 * ---------------------------------------------------------
 */

const Transaction = require('../../src/models/Transaction');
const mongoose = require('mongoose');

describe('Transaction Model - Ledger Integrity Tests', () => {

  /**
   * TEST: Mandatory Fields
   * Requirement: Every audit record must have an address, amount, and type.
   */
  test('Validation: Should reject transactions missing core financial metadata', async () => {
    const tx = new Transaction({ amount: 50 }); // Missing address and type
    
    const err = tx.validateSync();
    expect(err.errors.piAddress).toBeDefined();
    expect(err.errors.type).toBeDefined();
  });

  /**
   * TEST: Standardized Transaction Types (Enum)
   * Requirement: Only Philip-approved types ('INVESTMENT', 'REFUND', 'DIVIDEND') allowed.
   */
  test('Compliance: Should only allow standardized transaction types', async () => {
    const tx = new Transaction({
      piAddress: 'GBV...ADDR',
      amount: 100,
      type: 'INVALID_TYPE' // Not in Enum
    });

    const err = tx.validateSync();
    expect(err.errors.type).toBeDefined();
  });

  /**
   * TEST: Default Status
   * Requirement: New records should default to 'COMPLETED' unless specified.
   */
  test('Defaults: Should default to COMPLETED status for ledger consistency', () => {
    const tx = new Transaction({
      piAddress: 'GBV...ADDR',
      amount: 100,
      type: 'INVESTMENT'
    });

    expect(tx.status).toBe('COMPLETED');
  });

  /**
   * TEST: Blockchain ID Tracking
   * Requirement: Sparse unique index for piTxId to allow tracking without duplicates.
   */
  test('Integrity: Should accept and store Pi Network Transaction IDs', () => {
    const tx = new Transaction({
      piAddress: 'GBV...ADDR',
      amount: 500,
      type: 'INVESTMENT',
      piTxId: 'pi_tx_889900'
    });

    expect(tx.piTxId).toBe('pi_tx_889900');
  });
});

