/**
 * Investor Model Unit Tests - Data Integrity v1.3 (ESM Migration)
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Equity Tracker
 * ---------------------------------------------------------
 * PURPOSE: 
 * Validates Schema constraints for IPO participants. Ensures 
 * strict data integrity for Pi addresses and financial fields 
 * while maintaining compatibility with the Node.js ESM environment.
 */

import { jest } from '@jest/globals';
import mongoose from 'mongoose';
// Fix: Updated to use the explicit model filename and path for ESM
import Investor from '../../src/models/investor.model.js';

describe('Investor Model - Schema Integrity Tests', () => {

  /**
   * TEST: Required Fields
   * Requirement: Every record must have a unique piAddress for ledger tracking.
   */
  test('Validation: Should throw an error if piAddress is missing', async () => {
    const investor = new Investor({ totalPiContributed: 100 });
    
    const err = investor.validateSync();
    expect(err.errors.piAddress).toBeDefined();
  });

  /**
   * TEST: Non-Negative Contributions
   * Requirement: Financial integrity check (Ensures non-negative Pi values).
   */
  test('Financials: Should reject negative Pi contributions', async () => {
    const investor = new Investor({ 
      piAddress: 'GBV...ADDR', 
      totalPiContributed: -50 
    });

    const err = investor.validateSync();
    expect(err.errors.totalPiContributed).toBeDefined();
  });

  /**
   * TEST: Default Values
   * Requirement: New pioneers must initialize with clean equity states.
   */
  test('Defaults: Should initialize with 0 equity and COMPLIANT status', () => {
    const investor = new Investor({ piAddress: 'GBV...ADDR' });

    expect(investor.totalPiContributed).toBe(0);
    expect(investor.allocatedMapCap).toBe(0);
    expect(investor.isWhale).toBe(false);
  });

  /**
   * TEST: Timestamping & Audit Ready
   * Requirement: Philip's audit report requires lastContributionDate tracking.
   */
  test('Audit: Should have an automatically generated lastContributionDate', () => {
    const investor = new Investor({ piAddress: 'GBV...ADDR' });
    
    expect(investor.lastContributionDate).toBeDefined();
    expect(investor.lastContributionDate instanceof Date).toBe(true);
  });
});
