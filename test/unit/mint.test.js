/**
 * Initial Mint Unit Tests - Tokenomics v1.2
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings (Tokenomics)
 * * PURPOSE:
 * Validates the MapCap Genesis Mint parameters.
 * Ensures the Hard-Cap and Pool Allocations are immutable
 * and mathematically balanced before the LP transition.
 * ---------------------------------------------------------
 */

import MintConfig from '../../src/config/initial_mint.js';

describe('MapCap Mint Configuration - Unit Tests', () => {

  /**
   * TEST: Hard-Cap Integrity
   * Ensures the absolute supply is locked at 4,000,000.
   */
  test('Supply: Should have an absolute hard-cap of 4M MapCap units', () => {
    expect(MintConfig.TOTAL_MINT).toBe(4000000);
  });

  /**
   * TEST: Pool Allocation Balance
   * Requirement: IPO_POOL + LP_POOL must equal TOTAL_MINT.
   */
  test('Balance: IPO and LP pools must equal the total mint supply', () => {
    const totalCalculated = MintConfig.IPO_POOL + MintConfig.LP_POOL;
    expect(totalCalculated).toBe(MintConfig.TOTAL_MINT);
  });

  /**
   * TEST: IPO Scarcity Modeling
   * Confirms the specific allocation for the 4-week dynamic phase.
   */
  test('IPO Pool: Should match the 2,181,818 scarcity target', () => {
    expect(MintConfig.IPO_POOL).toBe(2181818);
  });

  /**
   * TEST: Standard Precision
   * Validates the 6-decimal standard for all minting operations.
   */
  test('Precision: Should follow the 6-decimal global standard', () => {
    expect(MintConfig.PRECISION).toBe(6);
  });

  /**
   * TEST: Configuration Immutability
   * Ensures tokenomics cannot be altered at runtime.
   */
  test('Security: Mint configuration should be frozen', () => {
    expect(Object.isFrozen(MintConfig)).toBe(true);
  });
});

