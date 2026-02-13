/**
 * Pi Network Config Unit Tests - Spec-Compliant v1.3
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Secure Payout Pipeline
 * * PURPOSE:
 * Validates the Pi Network & EscrowPi Configuration.
 * Ensures that API endpoints, gas fees, and timeout constants
 * are correctly initialized and immutable.
 * ---------------------------------------------------------
 */

import PiConfig from '../../src/config/pi_network.js';

describe('Pi Network & Escrow Config - Unit Tests', () => {

  /**
   * TEST: API Connectivity Constants
   * Verifies the core blockchain API endpoints.
   */
  test('API: Should have the correct Pi Network V2 base URL', () => {
    expect(PiConfig.api.baseUrl).toBe("https://api.minepi.com/v2");
  });

  /**
   * TEST: EscrowPi Protocol Integration
   * Validates the A2UaaS (App-to-User) payout gateway settings.
   */
  test('Escrow: Should correctly configure EscrowPi A2UaaS endpoints', () => {
    expect(PiConfig.escrow.payoutEndpoint).toBe("/payouts/a2uaas");
    expect(PiConfig.escrow.baseUrl).toContain("api.escrowpi.com");
  });

  /**
   * TEST: Financial Constants (Gas Fees)
   * Requirement: Standard Pi Network blockchain fee must be 0.01.
   */
  test('Constants: Should enforce the mandatory 0.01 Pi transaction fee', () => {
    expect(PiConfig.constants.txFee).toBe(0.01);
  });

  /**
   * TEST: Network Resilience (Timeouts)
   * Ensures the handshake timeout is set to 15 seconds for high-concurrency.
   */
  test('Resilience: Should have a request timeout of 15000ms', () => {
    expect(PiConfig.constants.requestTimeout).toBe(15000);
  });

  /**
   * TEST: Immutability Security
   * Ensures that Daniel's secure pipeline settings cannot be tampered with.
   */
  test('Security: Pi configuration object must be frozen', () => {
    expect(Object.isFrozen(PiConfig)).toBe(true);
  });
});

