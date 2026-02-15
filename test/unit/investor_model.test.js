/**
 * Investor Model Unit Tests - Data Integrity v1.6.5 (Philip's Use Case)
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Dynamic IPO Participation
 * ---------------------------------------------------------
 * PURPOSE: 
 * Validates Schema constraints for IPO participants. Ensures 
 * strict data integrity for Pi addresses while allowing dynamic 
 * balance fluctuations during the IPO period as per project requirements.
 */

import { jest } from '@jest/globals';
import mongoose from 'mongoose';
// Path maintained to ensure compatibility before Daniel's folder restructuring
import Investor from '../../src/models/investor.model.js';

describe('Investor Model - Schema Integrity Tests', () => {

  /**
   * TEST: Required Fields
   * Requirement: Every record must have a unique piAddress for ledger tracking.
   * Ensures the Frontend can always link a wallet to a contribution.
   */
  test('Validation: Should throw an error if piAddress is missing', async () => {
    const investor = new Investor({ totalPiContributed: 100 });
    
    const err = investor.validateSync();
    expect(err.errors.piAddress).toBeDefined();
  });

  /**
   * TEST: Non-Negative Contributions
   * Requirement: Financial integrity check (Ensures non-negative Pi values).
   * Prevents database anomalies in equity calculation.
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
   * TEST: Dynamic Balance Flexibility (Philip's Feedback)
   * Requirement: Allow balances to exceed temporary thresholds during IPO.
   * Validates that the Schema does NOT hard-cap contributions at this level.
   */
  test('Flexibility: Should allow contributions to exceed 10% during IPO phase', () => {
    const highValueContribution = 500000; // Simulating a large stake
    const investor = new Investor({ 
      piAddress: 'GBV...WHALE', 
      totalPiContributed: highValueContribution 
    });

    const err = investor.validateSync();
    // Expect no validation error even with high values (Capping moved to Settlement Job)
    expect(err).toBeUndefined();
    expect(investor.totalPiContributed).toBe(highValueContribution);
  });

  /**
   * TEST: Default Values
   * Requirement: New pioneers must initialize with clean equity states.
   * Crucial for the Frontend Dashboard to display correct 'Zero-State' data.
   */
  test('Defaults: Should initialize with 0 equity and non-whale status', () => {
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
