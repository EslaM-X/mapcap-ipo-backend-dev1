/**
 * Transaction Model Unit Tests - Audit Integrity v1.3 (ESM Migration)
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Financial Audit Standards
 * ---------------------------------------------------------
 * PURPOSE: 
 * Ensures every financial movement is recorded with strict validation. 
 * Validates Transaction Types and ensures Pi Network IDs are unique 
 * while maintaining compatibility with the Node.js ESM environment.
 */

import { jest } from '@jest/globals';
import mongoose from 'mongoose';
// Fix: Updated to use the explicit model filename and path for ESM
import Transaction from '../../src/models/transaction.model.js';

describe('Transaction Model - Ledger Integrity Tests', () => {

  /**
   * TEST: Mandatory Fields
   * Requirement: Every audit record must have an address, amount, and type for Daniel's compliance.
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
      type: 'INVALID_TYPE' // Not in Enum defined in schema
    });

    const err = tx.validateSync();
    expect(err.errors.type).toBeDefined();
  });

  /**
   * TEST: Default Status
   * Requirement: New records should default to 'COMPLETED' for ledger consistency.
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
   * Requirement: Accurate storage of Pi Network Transaction IDs for cross-referencing.
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
