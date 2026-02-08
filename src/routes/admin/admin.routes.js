/**
 * Admin Routes Provider - Secure Management Interface
 * ---------------------------------------------------------
 * Strategic routing for administrative operations.
 * This file centralizes login, health checks, and the final 10% trim-back logic.
 * * SECURITY: All critical endpoints are protected by adminAuth middleware.
 */
const express = require('express');
const router = express.Router();

// Importing controllers from the adjacent admin directory
const AdminController = require('../../controllers/admin/admin.controller');
const AuthController = require('../../controllers/admin/auth.controller');

// Importing security middleware to protect Philip & Daniel's dashboard
const adminAuth = require('../../middlewares/auth.middleware');

/**
 * @route   POST /api/admin/login
 * @desc    Authenticates Philip/Daniel for dashboard access.
 * @access  Public (Initial entry)
 */
router.post('/login', AuthController.adminLogin);

/**
 * @route   GET /api/admin/status
 * @desc    Real-time system health and uptime monitoring.
 * @access  Protected (Requires adminAuth)
 */
router.get('/status', adminAuth, AuthController.getSystemStatus);

/**
 * @route   POST /api/admin/settle
 * @desc    Critical: Triggers the 10% Whale Cap refund process via A2UaaS.
 * @access  Protected (Requires adminAuth)
 * * Note: This implements the mandatory refund for any pioneer exceeding 
 * [span_1](start_span)the 10% total balance cap as per Philip's Use Case[span_1](end_span).
 */
router.post('/settle', adminAuth, AdminController.triggerFinalSettlement);

module.exports = router;
