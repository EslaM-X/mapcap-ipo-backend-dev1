/**
 * Admin Model Unit Tests - RBAC Security v1.5.3
 * -------------------------------------------------------------------------
 * Fixed: Path resolution & Added Unique Constraint validation.
 * -------------------------------------------------------------------------
 */

// FIX: Path adjusted to match the consolidated backend structure
import Admin from '../../../src/models/admin.model.js'; 

describe('Admin Model - Security & Role Integrity Tests', () => {

  /**
   * TEST: Role-Based Access Control (Enum Enforcement)
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

    expect(validErr).toBeUndefined();
    expect(invalidErr.errors.role).toBeDefined();
    expect(invalidErr.errors.role.kind).toBe('enum'); // Ensuring it's an enum violation
  });

  /**
   * TEST: Credential Encapsulation & Privacy
   */
  test('Privacy: Should confirm password exclusion from default data projection', () => {
    // Daniel's Requirement: select: false is a non-negotiable security layer
    expect(Admin.schema.path('password').options.select).toBe(false);
  });

  /**
   * TEST: Operational Lifecycle Kill-Switch
   */
  test('Safety: Should default to active and support administrative revocation', () => {
    const admin = new Admin({ username: 'temp_admin', password: 'hash' });
    expect(admin.isActive).toBe(true);
    
    admin.isActive = false;
    expect(admin.isActive).toBe(false);
  });

  /**
   * TEST: Data Normalization (Anti-Spoofing)
   */
  test('Normalization: Should strictly lowercase usernames during model instantiation', () => {
    const admin = new Admin({
      username: 'ADMIN_Authority',
      password: 'hash'
    });
    
    expect(admin.username).toBe('admin_authority');
  });

  /**
   * TEST: Identity Uniqueness (Added for v1.5.3)
   */
  test('Integrity: Username field must have unique constraint enabled', () => {
    expect(Admin.schema.path('username').options.unique).toBe(true);
  });
});
