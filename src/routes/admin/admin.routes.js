/**
 * Admin Routes Provider - Secure Management Interface v1.4
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Security & Compliance
 * * PURPOSE:
 * Centralizes administrative operations including authentication,
 * health monitoring, and the mandatory 10% Whale-Cap settlement.
 * ---------------------------------------------------------
 */

import express from 'express';
import AdminController from '../../controllers/admin/admin.controller.js';
import AuthController from '../../controllers/admin/auth.controller.js';
import adminAuth from '../../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @route   POST /api/admin/login
 * @desc    Authenticates Philip or Daniel for secure dashboard access.
 * @access  Public (Entry Point)
 */
router.post('/login', AuthController.adminLogin);

/**
 * @route   GET /api/admin/status
 * @desc    Fetches real-time system health, uptime, and A2UaaS connectivity.
 * @access  Protected (Requires adminAuth Middleware)
 */
router.get('/status', adminAuth, AuthController.getSystemStatus);

/**
 * @route   POST /api/admin/settle
 * @desc    CRITICAL: Triggers the 10% Whale-Cap refund protocol.
 * @access  Protected (Requires adminAuth Middleware)
 * * COMPLIANCE: 
 * Implements the mandatory trim-back for Pioneers exceeding 
 * the 10% IPO pool cap as per Philip's Core Spec [Page 5].
 */
router.post('/settle', adminAuth, AdminController.triggerFinalSettlement);

/**
 * @route   GET /api/admin/audit-logs
 * @desc    Retrieves a detailed history of all A2UaaS transfers for Daniel's audit.
 * @access  Protected
 */
router.get('/audit-logs', adminAuth, AdminController.getAuditLogs);

export default router;
