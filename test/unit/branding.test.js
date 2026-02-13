/**
 * Branding & Configuration Unit Tests - Spec-Compliant v1.5
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Multi-Tenant Scalability
 * * PURPOSE:
 * Validates the White-Label Configuration Integrity.
 * Ensures core IPO mechanics, visual identity, and 
 * compliance metadata remain immutable and accurate.
 * ---------------------------------------------------------
 */

import brandingConfig from '../../src/config/branding.config.js';

describe('White-Label Branding Config - Unit Tests', () => {

  /**
   * TEST: Project Identity
   * Ensures the dashboard and project names are correctly set.
   */
  test('Identity: Should have the correct Project and Dashboard titles', () => {
    expect(brandingConfig.projectName).toBe("MapCap IPO");
    expect(brandingConfig.dashboardTitle).toBe("IPO Pulse Dashboard");
  });

  /**
   * TEST: IPO Core Mechanics (Philip's Spec)
   * Validates the scarcity modeling and anti-whale parameters.
   */
  test('Mechanics: Should align with Philip’s Fixed Supply and Whale Cap specs', () => {
    expect(brandingConfig.mechanics.totalMapCapSupply).toBe(2181818);
    expect(brandingConfig.mechanics.whaleCapPercentage).toBe(10);
    expect(brandingConfig.mechanics.vestingPeriodMonths).toBe(10);
  });

  /**
   * TEST: Visual Identity (Theme)
   * Validates the signature branding colors for UI consistency.
   */
  test('Theme: Should use MapCap Signature Gold as primary color', () => {
    expect(brandingConfig.theme.primaryColor.toLowerCase()).toBe("#d4af37");
    expect(brandingConfig.theme.currencySymbol).toBe("π");
  });

  /**
   * TEST: Immutability (Object.freeze)
   * Ensures that branding parameters cannot be modified at runtime.
   */
  test('Security: Branding config object should be frozen/immutable', () => {
    expect(Object.isFrozen(brandingConfig)).toBe(true);
    
    // Attempting to modify a property should not work in strict mode
    try {
        brandingConfig.projectName = "Hacker IPO";
    } catch (e) {
        // Expected error
    }
    expect(brandingConfig.projectName).toBe("MapCap IPO");
  });

  /**
   * TEST: Compliance Metadata
   * Verifies the audit standard and engine version.
   */
  test('Metadata: Should match Daniel’s Compliance Standard', () => {
    expect(brandingConfig.metadata.complianceAudit).toBe("Daniel_Standard_v1");
    expect(brandingConfig.metadata.engineType).toBe("A2UaaS_Standard");
  });
});

