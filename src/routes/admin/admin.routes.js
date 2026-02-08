/**
 * Admin Routes Provider
 * ---------------------------------------------------------
 * Strategic routing for administrative operations.
 * This file centralizes login, health checks, and the final 10% trim-back logic.
 */
const express = require('express');
const router = express.Router();

// Importing controllers from the adjacent admin directory
const AdminController = require('../../controllers/admin/admin.controller');
const AuthController = require('../../controllers/admin/auth.controller');

/**
 * @route   POST /api/admin/login
 * @desc    Authenticates Philip/Daniel for dashboard access
 */
router.post('/login', AuthController.adminLogin);

/**
 * @route   GET /api/admin/status
 * @desc    Real-time system health and uptime monitoring
 */
router.get('/status', AuthController.getSystemStatus);

/**
 * @route   POST /api/admin/settle
 * @desc    Critical: Triggers the 10% Whale Cap refund process via A2UaaS
 */
router.post('/settle', AdminController.triggerFinalSettlement);

module.exports = router;

