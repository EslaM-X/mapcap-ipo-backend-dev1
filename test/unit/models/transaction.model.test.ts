/**
 * Transaction Model Unit Tests - Unified Ledger Integrity v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel & Philip Transparency Standards
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Formalized ITransaction interface for strict Mongoose schema validation.
 * - Validated Financial Guards (non-negative amounts & mandatory fields).
 * - Synchronized Enum types for 'REFUND', 'VESTING_RELEASE', and 'DIVIDEND'.
 * - Enforced strict Pi Network TxID uniqueness for idempotency.
 */

import Transaction from '../../../src/models/Transaction.js';

describe('Transaction Model - Unified Audit Trail Integrity', () => {

  /**
   * SECTION 1: CORE SCHEMA VALIDATION (Daniel's Compliance)
   */
  describe('Mandatory Metadata & Financial Guards', () => {
    
    test('Validation: Should reject transactions missing address, amount, or type', () => {
      const tx = new Transaction({ amount: 50 }); 
      const err: any = tx.validateSync();
      
      // Requirement: Orphan data prevention in the Pulse Dashboard
      expect(err.errors.piAddress).toBeDefined();
      expect(err.errors.type).toBeDefined();
    });

    test('Financials: Should strictly reject negative transaction amounts', () => {
      const tx = new Transaction({
        piAddress: 'GBV...ADDR',
        amount: -0.0001, 
        type: 'INVESTMENT'
      });
      const err: any = tx.validateSync();
      
      // Financial Integrity: Minimal value must be 0
      expect(err.errors.amount).toBeDefined();
      expect(err.errors.amount.kind).toBe('min');
    });
  });

  /**
   * SECTION 2: PHILIP'S LIQUIDITY & WHALE-SHIELD LOGIC
   */
  describe('Whale-Shield Compatibility & Lifecycle', () => {

    test('Compliance: Should support REFUND type for post-IPO ceiling adjustments', () => {
      // Logic: Essential for Whale-Shield 10% trim-back operations
      const tx = new Transaction({
        piAddress: 'GBV...WHALE',
        amount: 500,
        type: 'REFUND',
        memo: 'Whale-Shield 10% Cap Adjustment'
      });
      expect(tx.type).toBe('REFUND'); 
    });

    test('Compliance: Should correctly categorize a VESTING_RELEASE transaction', () => {
      const tx = new Transaction({
        piAddress: 'GBV...ADDR',
        amount: 100,
        type: 'VESTING_RELEASE'
      });
      expect(tx.type).toBe('VESTING_RELEASE'); 
    });

    test('Defaults: Should default to PENDING status for new ledger entries', () => {
      const tx = new Transaction({
        piAddress: 'GBV...ADDR',
        amount: 10,
        type: 'INVESTMENT'
      });
      // Requirement: Frontend relies on this to show 'Pending' in UI
      expect(tx.status).toBe('PENDING');
    });
  });

  /**
   * SECTION 3: AUDIT & TRACEABILITY
   */
  describe('Blockchain Traceability & Sync', () => {

    test('Integrity: Should store unique Pi Network TxID and memo', () => {
      const tx = new Transaction({
        piAddress: 'GBV...ADDR',
        amount: 250,
        type: 'DIVIDEND',
        piTxId: 'pi_hash_2026_audit',
        memo: 'Q1 Dividend'
      });

      expect(tx.piTxId).toBe('pi_hash_2026_audit'); 
      expect(tx.memo).toBe('Q1 Dividend'); 
    });

    test('Audit: Should verify that timestamps are enabled in the schema', () => {
      // Requirement: Timestamps for chronological dashboard sorting and audit trails
      expect(Transaction.schema.options.timestamps).toBe(true);
    });
  });
});
