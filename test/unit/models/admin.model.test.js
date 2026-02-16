/**
 * Admin Model Unit Tests - RBAC Security v1.5.3
 * -------------------------------------------------------------------------
 * Description: Validates schema constraints, security layers, and data 
 * integrity for the Admin identity within the Map-of-Pi ecosystem.
 * * Fixed: Path resolution to align with the consolidated 'admin' directory.
 * -------------------------------------------------------------------------
 */

// FIX: Path updated to reach the nested folder structure: src/models/admin/
import Admin from '../../../src/models/admin/admin.model.js'; 

describe('Admin Model - Security & Role Integrity Tests', () => {

  /**
   * TEST: Role-Based Access Control (Enum Enforcement)
   * Ensures that only predefined roles (e.g., AUDITOR) are accepted.
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
      role: 'HACKER'
    });

    const validErr = auditor.validateSync();
    const invalidErr = unauthorizedActor.validateSync();

    // Valid role should not return validation errors
    expect(validErr).toBeUndefined();
    // Unauthorized role must trigger a Mongoose enum validation error
    expect(invalidErr.errors.role).toBeDefined();
    expect(invalidErr.errors.role.kind).toBe('enum'); 
  });

  /**
   * TEST: Credential Encapsulation & Privacy
   * Verification of the 'select: false' security layer to prevent password leaks.
   */
  test('Privacy: Should confirm password exclusion from default data projection', () => {
    // Critical security requirement: Password field must not be returned by default queries
    expect(Admin.schema.path('password').options.select).toBe(false);
  });

  /**
   * TEST: Operational Lifecycle Kill-Switch
   * Validates the status management for administrative accounts.
   */
  test('Safety: Should default to active and support administrative revocation', () => {
    const admin = new Admin({ username: 'temp_admin', password: 'hash' });
    expect(admin.isActive).toBe(true);
    
    admin.isActive = false;
    expect(admin.isActive).toBe(false);
  });

  /**
   * TEST: Data Normalization (Anti-Spoofing)
   * Ensures usernames are normalized to prevent case-sensitive duplication.
   */
  test('Normalization: Should strictly lowercase usernames during model instantiation', () => {
    const admin = new Admin({
      username: 'ADMIN_Authority',
      password: 'hash'
    });
    
    expect(admin.username).toBe('admin_authority');
  });

  /**
   * TEST: Identity Uniqueness (Version 1.5.3 Requirement)
   * Validates that the database-level unique constraint is active.
   */
  test('Integrity: Username field must have unique constraint enabled', () => {
    expect(Admin.schema.path('username').options.unique).toBe(true);
  });

});
