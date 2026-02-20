/**
 * Admin Routes Provider - Secure Management Interface v1.6.0
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Security & Compliance
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Centralizes administrative operations including secure authentication,
 * real-time health monitoring, Whale-Cap settlement, and Vesting releases.
 * Protected by high-level encryption and strict role-based access control.
 * -------------------------------------------------------------------------
 * UPDATED: Integrated manual Vesting trigger to align with Payout Pipeline tests.
 */

import express from 'express';
import AdminController from '../../controllers/admin/admin.controller.js';
import AuthController from '../../controllers/admin/auth.controller.js';
import adminAuth from '../../middlewares/auth.middleware.js'; // Secure Gateway

const router = express.Router();

/**
 * @route   POST /api/admin/login
 * @description Authenticates Admin Leads (Philip/Daniel) for secure dashboard access.
 * @access  Public (Entry Point)
 */
router.post('/login', AuthController.adminLogin);

/**
 * @route   GET /api/admin/status
 * @description Fetches real-time system health, uptime, and A2UaaS connectivity.
 * @access  Protected (Requires adminAuth Middleware)
 */
router.get('/status', adminAuth, AuthController.getSystemStatus);

/**
 * @route   POST /api/admin/settle
 * @description CRITICAL OPERATION: Triggers the 10% Whale-Cap refund protocol.
 * Synchronizes the ledger with the A2UaaS payout engine for final settlement.
 * @compliance Implements Philip's mandatory 10% trim-back for Pioneers.
 * @access  Protected (Requires adminAuth Middleware)
 */
router.post('/settle', adminAuth, AdminController.triggerFinalSettlement);

/**
 * @route   POST /api/admin/settle-vesting
 * @description VESTING PIPELINE: Manually triggers the 10% monthly release.
 * Validates against 'payout.pipeline.test.js' to ensure ledger increment.
 * @access  Protected (Requires adminAuth Middleware)
 */
router.post('/settle-vesting', adminAuth, AdminController.triggerVestingCycle);

/**
 * @route   GET /api/admin/audit-logs
 * @description Retrieves a detailed history of all administrative actions.
 * @access  Protected (Requires adminAuth Middleware)
 */
router.get('/audit-logs', adminAuth, AdminController.getAuditLogs);

export default router;
