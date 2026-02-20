/**
 * IPO Dashboard & Branding Integrity - Unified Pulse Suite v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel Compliance
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Implemented Partial<Request/Response> for type-safe Express mocking.
 * - Formalized branding configuration type checks.
 * - Synchronized Whale-Shield logic verification (10% Cap Enforcement).
 * - Ensured strict 6-decimal precision and formatted string assertions.
 */

import IpoController from '../../../src/controllers/ipo.controller.js';
import brandingConfig from '../../../src/config/branding.config.js';
import Investor from '../../../src/models/investor.model.js';
import { jest } from '@jest/globals';
import { Request, Response } from 'express';

describe('IPO Controller & Branding - Dashboard Logic Tests', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    // Identity resolution mock for Pi Network Auth
    mockReq = {
      user: { uid: 'test-pioneer-001' }
    } as any; // Type-cast for custom middleware 'user' property

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    
    // Database Mocking for deterministic Dashboard outputs
    jest.spyOn(Investor, 'aggregate').mockResolvedValue([{ totalPi: 100000, investorCount: 50 }]);
    jest.spyOn(Investor, 'findOne').mockResolvedValue({ 
      piAddress: 'test-pioneer-001', 
      totalPiContributed: 5000,
      vestingMonthsCompleted: 2 
    } as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  /**
   * SECTION 1: WHITE-LABEL IDENTITY & MECHANICS
   */
  describe('Branding & Compliance Metadata', () => {
    
    test('Identity: Should verify correct Project naming and UI Theme colors', () => {
      // Requirement: Signature Gold (#d4af37) consistency check
      expect(brandingConfig.projectName).toBe("MapCap IPO");
      expect(brandingConfig.theme.primaryColor.toLowerCase()).toBe("#d4af37");
    });

    test('Mechanics: Should align with Fixed Supply and Whale Cap specs', () => {
      // Requirement: Anti-whale parameters must remain at 10% for O(1) audit
      expect(brandingConfig.mechanics.totalMapCapSupply).toBe(2181818);
      expect(brandingConfig.mechanics.whaleCapPercentage).toBe(10);
    });

    test('Security: Branding configuration must be frozen to prevent runtime tampering', () => {
      // Daniel's Compliance Requirement: Immutable configuration
      expect(Object.isFrozen(brandingConfig)).toBe(true);
    });
  });

  /**
   * SECTION 2: PULSE DASHBOARD ENGINE (V1-V4)
   */
  describe('Dashboard Logic & Whale-Shield Status', () => {

    test('Financials: Should deliver accurate formatted values (V1-V4) for UI', async () => {
      await IpoController.getScreenStats(mockReq as Request, mockRes as Response);

      const responseData = (mockRes.json as jest.Mock).mock.calls[0][0].data;

      // Analysis: Total Pool and Capital Gain formatting for the Frontend
      expect(responseData.values.v1_totalInvestors).toBe(50);
      expect(responseData.values.v2_totalPool).toBe("100,000.00");
      expect(responseData.values.v4_capitalGain).toBe("6,000.00");
    });

    test('Whale-Shield: Should return COMPLIANT status if share is within 10% cap', async () => {
      await IpoController.getScreenStats(mockReq as Request, mockRes as Response);

      const compliance = (mockRes.json as jest.Mock).mock.calls[0][0].data.compliance;
      
      // LOGIC: 5,000 stake in 100,000 pool = 5% (Within 10% Limit)
      expect(compliance.isWhale).toBe(false);
      expect(compliance.status).toBe("COMPLIANT");
    });

    test('Resilience: Should fail gracefully with 500 status on DB failure', async () => {
      jest.spyOn(Investor, 'aggregate').mockRejectedValue(new Error("DB_OFFLINE"));
      
      await IpoController.getScreenStats(mockReq as Request, mockRes as Response);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      const lastCall = (mockRes.json as jest.Mock).mock.calls[0][0];
      expect(lastCall.success).toBe(false);
    });
  });
});
