/**
 * Admin Routes Provider - Secure Management Interface v1.4.1
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Security & Compliance
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Centralizes administrative operations including secure authentication,
 * real-time health monitoring, and the mandatory 10% Whale-Cap settlement.
 * Protected by high-level encryption and strict role-based access control.
 * -------------------------------------------------------------------------
 */

import express from 'express';
import AdminController from '../../controllers/admin/admin.controller.js';
import AuthController from '../../controllers/admin/auth.controller.js';
import adminAuth from '../../middlewares/auth.middleware.js'; // Secure Gateway

const router = express.Router();

/**
 * @route   POST /api/admin/login
 * @desc    Authenticates Admin Leads (Philip/Daniel) for secure dashboard access.
 * Generates a high-privilege JWT session token.
 * @access  Public (Entry Point)
 */
router.post('/login', AuthController.adminLogin);

/**
 * @route   GET /api/admin/status
 * @desc    Fetches real-time system health, uptime, and A2UaaS connectivity.
 * Essential for Philip to monitor the 'IPO Pulse' during peak weeks.
 * @access  Protected (Requires adminAuth Middleware)
 */
router.get('/status', adminAuth, AuthController.getSystemStatus);

/**
 * @route   POST /api/admin/settle
 * @desc    CRITICAL OPERATION: Triggers the 10% Whale-Cap refund protocol.
 * Synchronizes the ledger with the A2UaaS payout engine.
 * @access  Protected (Requires adminAuth Middleware)
 * @compliance Implements Philip's mandatory 10% trim-back for Pioneers.
 */
router.post('/settle', adminAuth, AdminController.triggerFinalSettlement);

/**
 * @route   GET /api/admin/audit-logs
 * @desc    Retrieves a detailed history of all administrative actions 
 * and A2UaaS transfers for Daniel's compliance audit.
 * @access  Protected (Requires adminAuth Middleware)
 */
router.get('/audit-logs', adminAuth, AdminController.getAuditLogs);



export default router;
