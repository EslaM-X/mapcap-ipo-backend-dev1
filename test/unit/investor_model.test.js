/**
 * Investor Model Unit Tests - Data Integrity v1.2
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Equity Tracker
 * * PURPOSE:
 * Validates the Schema constraints for IPO participants.
 * Ensures Pi addresses are unique, contributions are non-negative,
 * and indexing is optimized for the IPO Pulse Dashboard.
 * ---------------------------------------------------------
 */

const Investor = require('../../src/models/Investor');
const mongoose = require('mongoose');

describe('Investor Model - Schema Integrity Tests', () => {

  /**
   * TEST: Required Fields
   * Requirement: Every record must have a unique piAddress.
   */
  test('Validation: Should throw an error if piAddress is missing', async () => {
    const investor = new Investor({ totalPiContributed: 100 });
    
    const err = investor.validateSync();
    expect(err.errors.piAddress).toBeDefined();
  });

  /**
   * TEST: Non-Negative Contributions
   * Requirement: Financial integrity check (No negative Pi values).
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
   * Requirement: New pioneers should start with 0 MapCap and false Whale status.
   */
  test('Defaults: Should initialize with 0 equity and COMPLIANT (non-whale) status', () => {
    const investor = new Investor({ piAddress: 'GBV...ADDR' });

    expect(investor.totalPiContributed).toBe(0);
    expect(investor.allocatedMapCap).toBe(0);
    expect(investor.isWhale).toBe(false);
  });

  /**
   * TEST: Timestamping
   * Requirement: Tracking lastContributionDate for Philip's audit report.
   */
  test('Audit: Should have an automatically generated lastContributionDate', () => {
    const investor = new Investor({ piAddress: 'GBV...ADDR' });
    
    expect(investor.lastContributionDate).toBeDefined();
    expect(investor.lastContributionDate instanceof Date).toBe(true);
  });
});

