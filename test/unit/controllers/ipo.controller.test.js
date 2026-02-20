/**
 * IPO Dashboard & Branding Integrity - Unified Pulse Suite v1.8.0
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel Compliance
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * This suite validates the Dashboard Data Aggregator (Pulse Engine) and 
 * its alignment with White-Label Branding configurations. It ensures 
 * financial values (V1-V4), Whale-Shield status, and UI themes are 
 * synchronized for the Frontend.
 * -------------------------------------------------------------------------
 */

import IpoController from '../../../src/controllers/ipo.controller.js';
import brandingConfig from '../../../src/config/branding.config.js';
import Investor from '../../../src/models/investor.model.js';
import { jest } from '@jest/globals';

describe('IPO Controller & Branding - Dashboard Logic Tests', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    // Identity resolution mock for Pi Network Auth
    mockReq = {
      user: { uid: 'test-pioneer-001' }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    // Database Mocking for deterministic Dashboard outputs
    jest.spyOn(Investor, 'aggregate').mockResolvedValue([{ totalPi: 100000, investorCount: 50 }]);
    jest.spyOn(Investor, 'findOne').mockResolvedValue({ 
      piAddress: 'test-pioneer-001', 
      totalPiContributed: 5000,
      vestingMonthsCompleted: 2 
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * SECTION 1: WHITE-LABEL IDENTITY & MECHANICS
   * Ensures core IPO branding and Philip's scarcity parameters are immutable.
   * Frontend relies on these for Header titles and Progress bars.
   */
  describe('Branding & Compliance Metadata', () => {
    
    test('Identity: Should verify correct Project naming and UI Theme colors', () => {
      // Requirement: Signature Gold (#d4af37) must be consistent across UI
      expect(brandingConfig.projectName).toBe("MapCap IPO");
      expect(brandingConfig.theme.primaryColor.toLowerCase()).toBe("#d4af37");
    });

    test('Mechanics: Should align with Fixed Supply and Whale Cap specs', () => {
      // Requirement: Anti-whale parameters must remain at 10%
      expect(brandingConfig.mechanics.totalMapCapSupply).toBe(2181818);
      expect(brandingConfig.mechanics.whaleCapPercentage).toBe(10);
    });

    test('Security: Branding configuration must be frozen to prevent runtime tampering', () => {
      // Daniel's Requirement: Immutable config for audit traceability
      expect(Object.isFrozen(brandingConfig)).toBe(true);
    });
  });

  /**
   * SECTION 2: PULSE DASHBOARD ENGINE (V1-V4)
   * Validates the calculation logic for the main investor screen.
   */
  describe('Dashboard Logic & Whale-Shield Status', () => {

    test('Financials: Should deliver accurate formatted values (V1-V4) for UI', async () => {
      await IpoController.getScreenStats(mockReq, mockRes);

      const responseData = mockRes.json.mock.calls[0][0].data;

      // Analysis: Total Pool and Capital Gain formatting
      expect(responseData.values.v1_totalInvestors).toBe(50);
      expect(responseData.values.v2_totalPool).toBe("100,000.00");
      expect(responseData.values.v4_capitalGain).toBe("6,000.00");
    });

    test('Whale-Shield: Should return COMPLIANT status if share is within 10% cap', async () => {
      await IpoController.getScreenStats(mockReq, mockRes);

      const compliance = mockRes.json.mock.calls[0][0].data.compliance;
      
      // Calculation: 5,000 stake in 100,000 pool = 5% (Within 10% Limit)
      expect(compliance.isWhale).toBe(false);
      expect(compliance.status).toBe("COMPLIANT");
    });

    test('Resilience: Should fail gracefully with 500 status on DB pipeline collapse', async () => {
      jest.spyOn(Investor, 'aggregate').mockRejectedValue(new Error("DB_OFFLINE"));
      
      await IpoController.getScreenStats(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });
  });
});

