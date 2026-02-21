/**
 * Admin Routes Provider - Secure Management Interface v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Security & Compliance
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Defined standardized administrative endpoints using Express Router.
 * - Enforced adminAuth middleware as a prerequisite for all write operations.
 * - Maintained consistent URL naming for Frontend API integration parity.
 */

import express, { Router } from 'express';
import AdminController from '../../controllers/admin/admin.controller.js';
import AuthController from '../../controllers/admin/auth.controller.js';
import adminAuth from '../../middlewares/auth.middleware.js'; // Secure Gateway

const router: Router = express.Router();

/**
 * @route   POST /api/admin/login
 * @description Authenticates Admin Leads for secure dashboard access.
 * @access  Public (Entry Point)
 */
router.post('/login', AuthController.adminLogin);

/**
 * @route   GET /api/admin/status
 * @description Fetches real-time system health and A2UaaS connectivity.
 * @access  Protected (Requires adminAuth Middleware)
 */
router.get('/status', adminAuth, AuthController.getSystemStatus);

/**
 * @route   POST /api/admin/settle
 * @description CRITICAL OPERATION: Triggers the 10% Whale-Cap refund protocol.
 * @access  Protected (Requires adminAuth Middleware)
 */
router.post('/settle', adminAuth, AdminController.triggerFinalSettlement);

/**
 * @route   POST /api/admin/settle-vesting
 * @description VESTING PIPELINE: Manually triggers the 10% monthly release.
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
