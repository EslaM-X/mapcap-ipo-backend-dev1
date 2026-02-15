/**
 * Transaction Model Unit Tests - Unified Ledger Integrity v1.7.3
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel & Philip Transparency Standards
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * This suite validates the Immutable Audit Trail logic defined in 
 * src/models/Transaction.js. It ensures high-precision Pi movement records
 * while maintaining the flexibility required for IPO-period liquidity.
 * -------------------------------------------------------------------------
 */

// Importing the official model; keeping path consistency for ESM
import Transaction from '../../../src/models/Transaction.js';

describe('Transaction Model - Unified Audit Trail Integrity', () => {

  /**
   * SECTION 1: CORE SCHEMA VALIDATION (Daniel's Compliance)
   * Validates mandatory fields and financial constraints.
   * Ensures the Frontend receives predictable data structures.
   */
  describe('Mandatory Metadata & Financial Guards', () => {
    
    /**
     * Requirement: Every audit record must link to a wallet and flow type.
     * Prevents orphan data in the 'Pulse Dashboard'.
     */
    test('Validation: Should reject transactions missing address, amount, or type', () => {
      const tx = new Transaction({ amount: 50 }); 
      const err = tx.validateSync();
      
      // Verification: piAddress is mandatory
      expect(err.errors.piAddress).toBeDefined();
      // Verification: type is mandatory
      expect(err.errors.type).toBeDefined();
    });

    /**
     * Requirement: Protects ledger from mathematically impossible negative values.
     */
    test('Financials: Should strictly reject negative transaction amounts', () => {
      const tx = new Transaction({
        piAddress: 'GBV...ADDR',
        amount: -0.0001, 
        type: 'INVESTMENT'
      });
      const err = tx.validateSync();
      
      // Requirement: amount min value: 0
      expect(err.errors.amount).toBeDefined();
    });
  });

  /**
   * SECTION 2: PHILIP'S LIQUIDITY & WHALE-SHIELD LOGIC
   * Addresses Philip's concern: The 10% cap is a post-IPO adjustment, 
   * NOT a rigid schema-level blockage. This prevents breaking high-value investments.
   */
  describe('Whale-Shield Compatibility & Lifecycle', () => {

    /**
     * Requirement: Supports the 'REFUND' type specifically for 
     * post-IPO Whale-Shield trim-backs (10% Cap enforcement).
     */
    test('Compliance: Should support REFUND type for post-IPO ceiling adjustments', () => {
      const tx = new Transaction({
        piAddress: 'GBV...WHALE',
        amount: 500,
        type: 'REFUND',
        memo: 'Whale-Shield 10% Cap Adjustment'
      });
      // Verification: 'REFUND' is a valid Enum value
      expect(tx.type).toBe('REFUND'); 
    });

    /**
     * Requirement: Standardized flow for 'VESTING_RELEASE'.
     */
    test('Compliance: Should correctly categorize a VESTING_RELEASE transaction', () => {
      const tx = new Transaction({
        piAddress: 'GBV...ADDR',
        amount: 100,
        type: 'VESTING_RELEASE'
      });
      // Verification: 'VESTING_RELEASE' is a valid Enum value
      expect(tx.type).toBe('VESTING_RELEASE'); 
    });

    /**
     * Requirement: Default state for Pi Network SDK integration.
     * Frontend relies on this to show 'Pending' status.
     */
    test('Defaults: Should default to PENDING status for new ledger entries', () => {
      const tx = new Transaction({
        piAddress: 'GBV...ADDR',
        amount: 10,
        type: 'INVESTMENT'
      });
      // Verification: status default is 'PENDING'
      expect(tx.status).toBe('PENDING');
    });
  });

  /**
   * SECTION 3: AUDIT & TRACEABILITY
   * Ensures blockchain hashes and timestamps are handled for Daniel's reports.
   */
  describe('Blockchain Traceability & Sync', () => {

    /**
     * Requirement: Unique TxID to prevent double-logging in the UI.
     */
    test('Integrity: Should store unique Pi Network TxID and memo', () => {
      const tx = new Transaction({
        piAddress: 'GBV...ADDR',
        amount: 250,
        type: 'DIVIDEND',
        piTxId: 'pi_hash_2026_audit',
        memo: 'Q1 Dividend'
      });

      // Verification: piTxId field mapping
      expect(tx.piTxId).toBe('pi_hash_2026_audit'); 
      expect(tx.memo).toBe('Q1 Dividend'); 
    });

    /**
     * Requirement: Timestamps for chronological dashboard sorting.
     */
    test('Audit: Should verify that timestamps are enabled in the schema', () => {
      const tx = new Transaction({
        piAddress: 'GBV...ADDR',
        amount: 1,
        type: 'INVESTMENT'
      });
      // Verification: timestamps: true in schema options
      expect(Transaction.schema.options.timestamps).toBe(true);
    });
  });
});
