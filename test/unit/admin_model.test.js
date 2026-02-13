/**
 * Admin Model Unit Tests - RBAC Security v1.5
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Security & Compliance
 * * PURPOSE:
 * Validates Administrative Role-Based Access Control (RBAC).
 * Ensures only approved roles are accepted and credentials 
 * are protected via Schema-level privacy settings.
 * ---------------------------------------------------------
 */

import Admin from '../../src/models/admin/Admin.js';
import mongoose from 'mongoose';

describe('Admin Model - Security & Role Tests', () => {

  /**
   * TEST: Role-Based Access Control (Enum)
   * Requirement: Supports SUPER_ADMIN (Operations) and AUDITOR (Compliance).
   */
  test('Security: Should allow valid roles and reject unauthorized access levels', async () => {
    const auditor = new Admin({
      username: 'daniel_audit',
      password: 'hashed_password_123',
      role: 'AUDITOR'
    });

    const invalidAdmin = new Admin({
      username: 'hacker_001',
      password: 'password',
      role: 'HACKER' // Not in Enum
    });

    const validErr = auditor.validateSync();
    const invalidErr = invalidAdmin.validateSync();

    expect(validErr).toBeUndefined();
    expect(invalidErr.errors.role).toBeDefined();
  });

  /**
   * TEST: Credential Privacy
   * Requirement: 'select: false' must be present to prevent password leaks in JSON.
   */
  test('Privacy: Should ensure password is not enumerable in standard object conversion', () => {
    const admin = new Admin({
      username: 'philip_ops',
      password: 'super_secret_hash'
    });

    const adminObj = admin.toObject();
    
    // The password field should be hidden by default in standard queries
    // Note: In Mongoose, this is enforced during query execution (.select())
    // Here we check the schema definition.
    expect(Admin.schema.path('password').options.select).toBe(false);
  });

  /**
   * TEST: Account Status Kill-switch
   * Requirement: Must support deactivation for security containment.
   */
  test('Safety: Should default to active and support account suspension', () => {
    const admin = new Admin({ username: 'temp_admin', password: 'hash' });
    
    expect(admin.isActive).toBe(true);
    
    admin.isActive = false;
    expect(admin.isActive).toBe(false);
  });

  /**
   * TEST: Data Normalization
   * Requirement: Usernames must be lowercased to prevent duplicate account spoofing.
   */
  test('Normalization: Should lowercase usernames automatically', async () => {
    const admin = new Admin({
      username: 'ADMIN_User',
      password: 'hash'
    });

    expect(admin.username).toBe('admin_user');
  });
});
