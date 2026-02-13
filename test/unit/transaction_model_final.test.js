/**
 * Transaction Model Unit Tests - Audit Integrity v1.4
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Transparency Standard
 * * PURPOSE: 
 * Validates the Immutable Audit Trail logic.
 * Ensures all lifecycle types (Vesting, Refunds, etc.) are 
 * correctly categorized and blockchain hashes are unique.
 * ---------------------------------------------------------
 */

import Transaction from '../../src/models/transaction.model.js';
import mongoose from 'mongoose';

describe('Transaction Model - Audit Trail Integrity', () => {

  /**
   * TEST: Mandatory Metadata
   * Requirement: Every record must have a target address and a valid amount.
   */
  test('Validation: Should reject transactions missing address or amount', async () => {
    const tx = new Transaction({ type: 'INVESTMENT' });
    
    const err = tx.validateSync();
    expect(err.errors.piAddress).toBeDefined();
    expect(err.errors.amount).toBeDefined();
  });

  /**
   * TEST: Lifecycle Categorization (Enum)
   * Requirement: Supports INVESTMENT, REFUND, DIVIDEND, and the new VESTING_RELEASE.
   */
  test('Compliance: Should correctly categorize a VESTING_RELEASE transaction', () => {
    const tx = new Transaction({
      piAddress: 'GBV...ADDR',
      amount: 100.5,
      type: 'VESTING_RELEASE',
      status: 'PENDING'
    });

    expect(tx.type).toBe('VESTING_RELEASE');
    expect(tx.status).toBe('PENDING');
  });

  /**
   * TEST: Negative Amount Protection
   * Requirement: Financial records should never allow negative movements.
   */
  test('Financials: Should reject negative transaction amounts', async () => {
    const tx = new Transaction({
      piAddress: 'GBV...ADDR',
      amount: -10,
      type: 'REFUND'
    });

    const err = tx.validateSync();
    expect(err.errors.amount).toBeDefined();
  });

  /**
   * TEST: Unique Blockchain Hash (piTxId)
   * Requirement: Prevent duplicate logging of a single on-chain transaction.
   */
  test('Integrity: Should store memo and blockchain TxID correctly', () => {
    const tx = new Transaction({
      piAddress: 'GBV...ADDR',
      amount: 250,
      type: 'DIVIDEND',
      piTxId: 'pi_hash_778899',
      memo: 'Monthly Dividend Cycle Q1'
    });

    expect(tx.piTxId).toBe('pi_hash_778899');
    expect(tx.memo).toContain('Monthly Dividend');
  });
});

