/**
 * Admin Model Unit Tests - RBAC Security v1.5.2
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Security & Compliance
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * This test suite validates Administrative Role-Based Access Control (RBAC).
 * It ensures rigorous enforcement of authorized roles and guarantees that 
 * sensitive credentials remain encapsulated via Schema-level privacy.
 * -------------------------------------------------------------------------
 */

// Synchronizing path with the new Backend directory architecture
import Admin from '../../../src/models/admin/admin.model.js';

describe('Admin Model - Security & Role Integrity Tests', () => {

  /**
   * TEST: Role-Based Access Control (Enum Enforcement)
   * Requirement: Supports 'SUPER_ADMIN' (Operations) and 'AUDITOR' (Compliance).
   * Verifies the schema's ability to intercept unauthorized privilege levels.
   */
  test('Security: Should validate authorized roles and reject arbitrary access levels', async () => {
    const auditor = new Admin({
      username: 'daniel_audit',
      password: 'hashed_password_123',
      role: 'AUDITOR'
    });

    const unauthorizedActor = new Admin({
      username: 'hacker_001',
      password: 'password',
      role: 'HACKER' // Intentional Out-of-Enum value
    });

    const validErr = auditor.validateSync();
    const invalidErr = unauthorizedActor.validateSync();

    expect(validErr).toBeUndefined();
    expect(invalidErr.errors.role).toBeDefined();
  });

  /**
   * TEST: Credential Encapsulation & Privacy
   * Requirement: Daniel's Compliance - 'select: false' directive.
   * Ensures administrative hashes are omitted from standard query results.
   */
  test('Privacy: Should confirm password exclusion from default data projection', () => {
    // Asserting the Mongoose schema definition directly for field-level security
    expect(Admin.schema.path('password').options.select).toBe(false);
  });

  /**
   * TEST: Operational Lifecycle Kill-Switch
   * Requirement: Protocol-level support for immediate account suspension.
   * Validates 'isActive' status defaults and administrative mutability.
   */
  test('Safety: Should default to active and support administrative revocation', () => {
    const admin = new Admin({ username: 'temp_admin', password: 'hash' });
    expect(admin.isActive).toBe(true);
    
    // Simulating defensive account deactivation
    admin.isActive = false;
    expect(admin.isActive).toBe(false);
  });

  /**
   * TEST: Data Normalization (Anti-Spoofing)
   * Requirement: Lowercase username coercion to prevent identity overlap.
   * Ensures deterministic username resolution across the administrative panel.
   */
  test('Normalization: Should strictly lowercase usernames during model instantiation', () => {
    const admin = new Admin({
      username: 'ADMIN_Authority',
      password: 'hash'
    });
    
    // Verifying the normalization hook successfully sanitizes the input
    expect(admin.username).toBe('admin_authority');
  });
});
