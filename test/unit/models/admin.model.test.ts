/**
 * Admin Model Unit Tests - RBAC Security v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: RBAC & Credential Encapsulation
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Aligned path resolution with consolidated 'admin' directory.
 * - Formalized IAdmin interface checks within the Mongoose Schema context.
 * - Validated Case-Insensitive Normalization (Anti-Spoofing).
 * - Enforced strict Enum validation for roles (SUPER_ADMIN, AUDITOR, etc.).
 */

import Admin from '../../../src/models/admin/admin.model.js';

describe('Admin Model - Security & Role Integrity Tests', () => {

  /**
   * @test Role-Based Access Control (Enum Enforcement)
   * Requirement: Daniel's Compliance - Only predefined roles are accepted.
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
    const invalidErr: any = unauthorizedActor.validateSync();

    // Valid role should not return validation errors
    expect(validErr).toBeUndefined();
    // Unauthorized role must trigger a Mongoose enum validation error
    expect(invalidErr.errors.role).toBeDefined();
    expect(invalidErr.errors.role.kind).toBe('enum'); 
  });

  /**
   * @test Credential Encapsulation & Privacy
   * Verification: 'select: false' ensures password exclusion in default queries.
   */
  test('Privacy: Should confirm password exclusion from default data projection', () => {
    // Critical security requirement: Prevent accidental password leaks in API responses
    const passwordPath: any = Admin.schema.path('password');
    expect(passwordPath.options.select).toBe(false);
  });

  /**
   * @test Operational Lifecycle Kill-Switch
   * Ensures administrative revocation (isActive flag) is functional.
   */
  test('Safety: Should default to active and support administrative revocation', () => {
    const admin = new Admin({ username: 'temp_admin', password: 'hash' });
    expect(admin.isActive).toBe(true);
    
    admin.isActive = false;
    expect(admin.isActive).toBe(false);
  });

  /**
   * @test Data Normalization (Anti-Spoofing)
   * Requirement: Lowercase usernames to prevent 'Admin' vs 'admin' duplication.
   */
  test('Normalization: Should strictly lowercase usernames during model instantiation', () => {
    const admin = new Admin({
      username: 'ADMIN_Authority',
      password: 'hash'
    });
    
    expect(admin.username).toBe('admin_authority');
  });

  /**
   * @test Identity Uniqueness
   * Validates database-level unique constraint for the identity layer.
   */
  test('Integrity: Username field must have unique constraint enabled', () => {
    const usernamePath: any = Admin.schema.path('username');
    expect(usernamePath.options.unique).toBe(true);
  });

});
