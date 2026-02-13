/**
 * Gitignore Policy Unit Tests - Security Guard v1.0
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Security & Compliance
 * * PURPOSE:
 * Validates that sensitive files and bulky dependencies are 
 * properly ignored by the version control system.
 * ---------------------------------------------------------
 */

import fs from 'fs';
import path from 'path';

describe('Gitignore Policy - Privacy & Cleanliness Tests', () => {
  const gitignorePath = path.resolve(process.cwd(), '.gitignore');
  const content = fs.readFileSync(gitignorePath, 'utf8');

  /**
   * TEST: Security Critical (Environment Variables)
   * Requirement: .env must NEVER be tracked.
   */
  test('Security: Should explicitly ignore .env files to prevent credential leaks', () => {
    expect(content).toMatch(/^\.env$/m);
    expect(content).toMatch(/^\.env\.local$/m);
  });

  /**
   * TEST: Dependency Management
   * Requirement: node_modules must be excluded to keep the repo lightweight.
   */
  test('Architecture: Should ignore node_modules directory', () => {
    expect(content).toMatch(/^node_modules\/$/m);
  });

  /**
   * TEST: Audit Logs Exclusion
   * Requirement: Logs should be stored locally, not on GitHub.
   */
  test('Cleanliness: Should ignore log files and directories', () => {
    expect(content).toMatch(/^logs\/$/m);
    expect(content).toMatch(/^\*\.log$/m);
  });

  /**
   * TEST: IDE Metadata
   * Requirement: VSCode and OS-specific files should be ignored.
   */
  test('Optimization: Should ignore IDE-specific configurations (.vscode)', () => {
    expect(content).toMatch(/^\.vscode\/$/m);
    expect(content).toMatch(/^\.DS_Store$/m);
  });
});

