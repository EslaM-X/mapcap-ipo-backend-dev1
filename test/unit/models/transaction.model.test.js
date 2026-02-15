/**
 * Transaction Model Unit Tests - Unified Ledger Integrity v1.7.0
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel & Philip Transparency Standards
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * This suite validates the Immutable Audit Trail logic. It ensures that every 
 * financial movement (Investment, Vesting, Refund) is recorded with high-fidelity 
 * validation, preventing data anomalies and ensuring blockchain-sync readiness.
 * -------------------------------------------------------------------------
 */

import Transaction from '../../../src/models/transaction.model.js';

describe('Transaction Model - Unified Audit Trail Integrity', () => {

  /**
   * SECTION 1: CORE VALIDATION (Daniel's Compliance)
   * Ensures the ledger rejects incomplete or mathematically impossible records.
   */
  describe('Mandatory Metadata & Financial Guards', () => {
    
    test('Validation: Should reject transactions missing address, amount, or type', () => {
      const tx = new Transaction({ amount: 50 }); // Missing piAddress and type
      const err = tx.validateSync();
      
      expect(err.errors.piAddress).toBeDefined();
      expect(err.errors.type).toBeDefined();
    });

    test('Financials: Should strictly reject negative transaction amounts', () => {
      const tx = new Transaction({
        piAddress: 'GBV...ADDR',
        amount: -10,
        type: 'REFUND'
      });
      const err = tx.validateSync();
      // Requirement: Financial records must only store non-negative movements.
      expect(err.errors.amount).toBeDefined();
    });
  });

  /**
   * SECTION 2: LIFECYCLE CATEGORIZATION (Philip's Requirements)
   * Validates support for all standardized transaction types in the ecosystem.
   */
  describe('Compliance & Lifecycle Categorization', () => {

    test('Enum: Should correctly categorize a VESTING_RELEASE transaction', () => {
      const tx = new Transaction({
        piAddress: 'GBV...ADDR',
        amount: 100.5,
        type: 'VESTING_RELEASE'
      });
      expect(tx.type).toBe('VESTING_RELEASE');
    });

    test('Enum: Should reject unauthorized or non-standard transaction types', () => {
      const tx = new Transaction({
        piAddress: 'GBV...ADDR',
        amount: 100,
        type: 'UNAUTHORIZED_TYPE' 
      });
      const err = tx.validateSync();
      expect(err.errors.type).toBeDefined();
    });

    test('Defaults: Should default to PENDING status to align with Pi SDK lifecycle', () => {
      const tx = new Transaction({
        piAddress: 'GBV...ADDR',
        amount: 100,
        type: 'INVESTMENT'
      });
      // Verification for Frontend wait-states management
      expect(tx.status).toBe('PENDING');
    });
  });

  /**
   * SECTION 3: BLOCKCHAIN SYNC INTEGRITY
   * Ensures Pi Network transaction hashes and memos are persisted correctly.
   */
  describe('Blockchain ID Tracking', () => {

    test('Integrity: Should accurately store Pi Network TxID and memo', () => {
      const tx = new Transaction({
        piAddress: 'GBV...ADDR',
        amount: 500,
        type: 'DIVIDEND',
        piTxId: 'pi_hash_778899',
        memo: 'Monthly Dividend Cycle Q1'
      });

      expect(tx.piTxId).toBe('pi_hash_778899');
      expect(tx.memo).toContain('Monthly Dividend');
    });
  });
});

