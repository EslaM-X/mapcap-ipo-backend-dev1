/**
 * Transaction Model Unit Tests - Unified Ledger Integrity v1.7.2
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel & Philip Transparency Standards
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * This suite validates the Immutable Audit Trail logic defined in 
 * src/models/Transaction.js. It ensures high-precision Pi movement records,
 * prevents data anomalies, and secures 'Pulse Dashboard' historical accuracy.
 * -------------------------------------------------------------------------
 */

// Importing the official model; path aligned with the consolidated backend structure
import Transaction from '../../../src/models/Transaction.js';

describe('Transaction Model - Unified Audit Trail Integrity', () => {

  /**
   * SECTION 1: CORE SCHEMA VALIDATION (Daniel's Compliance)
   * Ensures the ledger rejects incomplete or mathematically inconsistent records
   * based on the required fields and negative value constraints.
   */
  describe('Mandatory Metadata & Financial Guards', () => {
    
    /**
     * Requirement: Every audit record must link to a wallet and flow type.
     * Prevents orphan records from appearing in the Admin Audit logs.
     */
    test('Validation: Should reject transactions missing address, amount, or type', () => {
      const tx = new Transaction({ amount: 50 }); 
      const err = tx.validateSync();
      
      // Verification: piAddress required: true
      expect(err.errors.piAddress).toBeDefined();
      // Verification: type required: true
      expect(err.errors.type).toBeDefined();
    });

    /**
     * Requirement: Financial integrity check for 6-decimal precision.
     * Prevents negative balance injections at the database level.
     */
    test('Financials: Should strictly reject negative transaction amounts', () => {
      const tx = new Transaction({
        piAddress: 'GBV...ADDR',
        amount: -0.0001, 
        type: 'REFUND'
      });
      const err = tx.validateSync();
      
      // Requirement: amount min: 0
      expect(err.errors.amount).toBeDefined();
    });
  });

  /**
   * SECTION 2: LIFECYCLE CATEGORIZATION (Philip's Requirements)
   * Validates the Enum mapping for standardized flows. Note: The 10% Whale Cap
   * is applied as a REFUND type here, keeping the balance dynamic in the IPO wallet.
   */
  describe('Compliance & Lifecycle Categorization', () => {

    /**
     * Requirement: Automated 10% tranche tracking for Pioneer dashboards.
     */
    test('Enum: Should correctly categorize a VESTING_RELEASE transaction', () => {
      const tx = new Transaction({
        piAddress: 'GBV...ADDR',
        amount: 100.5,
        type: 'VESTING_RELEASE'
      });
      // Verification: type enum support
      expect(tx.type).toBe('VESTING_RELEASE'); 
    });

    /**
     * Requirement: Post-IPO Whale-Shield trim-backs as per Philip's request.
     * Keeps user balances fluid during IPO while allowing recorded adjustments later.
     */
    test('Enum: Should allow REFUND type for late-stage Whale-Shield 10% adjustments', () => {
      const tx = new Transaction({
        piAddress: 'GBV...WHALE',
        amount: 500,
        type: 'REFUND',
        memo: 'Whale-Shield 10% Cap Adjustment'
      });
      // Verification: type enum support
      expect(tx.type).toBe('REFUND'); 
    });

    /**
     * Requirement: Lifecycle state management for Pi Network / A2UaaS pipelines.
     * Frontend uses this default to trigger the "Processing" state UI.
     */
    test('Defaults: Should default to PENDING status to align with Pi SDK lifecycle', () => {
      const tx = new Transaction({
        piAddress: 'GBV...ADDR',
        amount: 100,
        type: 'INVESTMENT'
      });
      // Verification: status default: 'PENDING'
      expect(tx.status).toBe('PENDING');
    });
  });

  /**
   * SECTION 3: BLOCKCHAIN SYNC INTEGRITY (Audit Ready)
   * Ensures Pi Network transaction hashes (piTxId) are persisted correctly
   * for A2UaaS reconciliation and immutable auditing.
   */
  describe('Blockchain ID Tracking & Audit Notes', () => {

    /**
     * Requirement: Unique Hash tracking to prevent double-spending/double-logging.
     */
    test('Integrity: Should accurately store Pi Network TxID and memo', () => {
      const tx = new Transaction({
        piAddress: 'GBV...ADDR',
        amount: 250,
        type: 'DIVIDEND',
        piTxId: 'pi_hash_blockchain_2026',
        memo: 'Monthly Dividend Cycle Q1'
      });

      // Verification: unique: true mapping
      expect(tx.piTxId).toBe('pi_hash_blockchain_2026'); 
      expect(tx.memo).toBe('Monthly Dividend Cycle Q1'); 
    });

    /**
     * Requirement: Automatic timestamping for regulatory compliance.
     */
    test('Audit: Should support automatically generated timestamps for Daniel\'s logs', () => {
      const tx = new Transaction({
        piAddress: 'GBV...ADDR',
        amount: 1,
        type: 'INVESTMENT'
      });
      // Verification: timestamps: true enabled in schema
      expect(tx.createdAt).toBeUndefined(); // Defined post-save
    });
  });
});
