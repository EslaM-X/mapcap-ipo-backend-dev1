# MapCap IPO Test Audit - Mon Feb 16 21:24:13 EET 2026
## Environment: v25.3.0
---

> mapcap-ipo-backend@1.7.0 test
> cross-env NODE_ENV=test NODE_OPTIONS='--experimental-vm-modules' jest --runInBand --detectOpenHandles --verbose

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:24:25.262Z - [INFO]: MapCap Audit Engine v1.5.5 Synchronized for Cloud Deployment.
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

(node:15761) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
  console.log
    
    ✅ TEST_ENGINE_READY: Connected to Remote Atlas

      at Object.<anonymous> (test/setup.js:43:15)

  console.log
    [SECURITY_LOG] Admin Privilege Elevated | Time: 2026-02-16T19:24:27.913Z | IP: ::ffff:127.0.0.1

      at adminAuth (src/middlewares/auth.middleware.js:45:17)

  console.log
    [ADMIN_ACTION] Manual Post-IPO Settlement sequence initiated at 2026-02-16T19:24:27.925Z

      at triggerFinalSettlement (src/controllers/admin/admin.controller.js:31:21)

  console.log
    --- [COMPLIANCE] Initiating Post-IPO Final Settlement Sequence ---

      at SettlementJob.executeWhaleTrimBack (src/jobs/settlement.job.js:29:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:24:28.030Z - [INFO]: Whale Settlement Triggered. Final Water-Level: 5000 Pi
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.warn
    [WHALE_CAP_TRIGGERED] Wallet: PIONEER_PAYOUT_001 | Surplus: 4500 Pi

      50 |                 if (preciseRefund <= 0) continue;
      51 |
    > 52 |                 console.warn(`[WHALE_CAP_TRIGGERED] Wallet: ${investor.piAddress} | Surplus: ${preciseRefund} Pi`);
         |                         ^
      53 |
      54 |                 try {
      55 |                     /**

      at SettlementJob.executeWhaleTrimBack (src/jobs/settlement.job.js:52:25)
      at triggerFinalSettlement (src/controllers/admin/admin.controller.js:63:28)

  console.error
    [CRITICAL_A2U_FAILURE]: getaddrinfo ENOTFOUND api.escrowpi.com

      73 |              */
      74 |             const errorDetails = error.response?.data || error.message;
    > 75 |             console.error("[CRITICAL_A2U_FAILURE]:", errorDetails);
         |                     ^
      76 |             
      77 |             // Critical failures are thrown to stop automated jobs and prevent inconsistent states
      78 |             throw new Error(`A2UaaS pipeline disrupted: ${JSON.stringify(errorDetails)}`);

      at PayoutService.executeA2UPayout (src/services/payout.service.js:75:21)
      at SettlementJob.executeWhaleTrimBack (src/jobs/settlement.job.js:59:21)
      at triggerFinalSettlement (src/controllers/admin/admin.controller.js:63:28)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T19:24:28.254Z - [CRITICAL]: PAYOUT_FAILED for PIONEER_PAYOUT_001: A2UaaS pipeline disrupted: "getaddrinfo ENOTFOUND api.escrowpi.com"
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at writeAuditLog (src/config/logger.js:66:17)
      at SettlementJob.executeWhaleTrimBack (src/jobs/settlement.job.js:72:21)
      at triggerFinalSettlement (src/controllers/admin/admin.controller.js:63:28)

  console.error
    [CRITICAL_FAILURE] Settlement execution error for PIONEER_PAYOUT_001

      71 |                 } catch (payoutError) {
      72 |                     writeAuditLog('CRITICAL', `PAYOUT_FAILED for ${investor.piAddress}: ${payoutError.message}`);
    > 73 |                     console.error(`[CRITICAL_FAILURE] Settlement execution error for ${investor.piAddress}`);
         |                             ^
      74 |                 }
      75 |             }
      76 |

      at SettlementJob.executeWhaleTrimBack (src/jobs/settlement.job.js:73:29)
      at triggerFinalSettlement (src/controllers/admin/admin.controller.js:63:28)

  console.log
    --- [SUMMARY] Settlement Finalized. Total Refunded: 0 | Accounts Capped: 0 ---

      at SettlementJob.executeWhaleTrimBack (src/jobs/settlement.job.js:77:21)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:24:28.265Z - [INFO]: Settlement Finalized. Total Refunded: 0 | Accounts Capped: 0
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    [SECURITY_LOG] Admin Privilege Elevated | Time: 2026-02-16T19:24:28.877Z | IP: ::ffff:127.0.0.1

      at adminAuth (src/middlewares/auth.middleware.js:45:17)

  console.log
    [ADMIN_ACTION] Manual Post-IPO Settlement sequence initiated at 2026-02-16T19:24:28.887Z

      at triggerFinalSettlement (src/controllers/admin/admin.controller.js:31:21)

  console.log
    --- [COMPLIANCE] Initiating Post-IPO Final Settlement Sequence ---

      at SettlementJob.executeWhaleTrimBack (src/jobs/settlement.job.js:29:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:24:28.981Z - [INFO]: Whale Settlement Triggered. Final Water-Level: 5000 Pi
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.warn
    [WHALE_CAP_TRIGGERED] Wallet: PIONEER_FAIL_TEST | Surplus: 4500 Pi

      50 |                 if (preciseRefund <= 0) continue;
      51 |
    > 52 |                 console.warn(`[WHALE_CAP_TRIGGERED] Wallet: ${investor.piAddress} | Surplus: ${preciseRefund} Pi`);
         |                         ^
      53 |
      54 |                 try {
      55 |                     /**

      at SettlementJob.executeWhaleTrimBack (src/jobs/settlement.job.js:52:25)
      at triggerFinalSettlement (src/controllers/admin/admin.controller.js:63:28)

  console.error
    [CRITICAL_A2U_FAILURE]: getaddrinfo ENOTFOUND api.escrowpi.com

      73 |              */
      74 |             const errorDetails = error.response?.data || error.message;
    > 75 |             console.error("[CRITICAL_A2U_FAILURE]:", errorDetails);
         |                     ^
      76 |             
      77 |             // Critical failures are thrown to stop automated jobs and prevent inconsistent states
      78 |             throw new Error(`A2UaaS pipeline disrupted: ${JSON.stringify(errorDetails)}`);

      at PayoutService.executeA2UPayout (src/services/payout.service.js:75:21)
      at SettlementJob.executeWhaleTrimBack (src/jobs/settlement.job.js:59:21)
      at triggerFinalSettlement (src/controllers/admin/admin.controller.js:63:28)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T19:24:29.110Z - [CRITICAL]: PAYOUT_FAILED for PIONEER_FAIL_TEST: A2UaaS pipeline disrupted: "getaddrinfo ENOTFOUND api.escrowpi.com"
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at writeAuditLog (src/config/logger.js:66:17)
      at SettlementJob.executeWhaleTrimBack (src/jobs/settlement.job.js:72:21)
      at triggerFinalSettlement (src/controllers/admin/admin.controller.js:63:28)

  console.error
    [CRITICAL_FAILURE] Settlement execution error for PIONEER_FAIL_TEST

      71 |                 } catch (payoutError) {
      72 |                     writeAuditLog('CRITICAL', `PAYOUT_FAILED for ${investor.piAddress}: ${payoutError.message}`);
    > 73 |                     console.error(`[CRITICAL_FAILURE] Settlement execution error for ${investor.piAddress}`);
         |                             ^
      74 |                 }
      75 |             }
      76 |

      at SettlementJob.executeWhaleTrimBack (src/jobs/settlement.job.js:73:29)
      at triggerFinalSettlement (src/controllers/admin/admin.controller.js:63:28)

  console.log
    --- [SUMMARY] Settlement Finalized. Total Refunded: 0 | Accounts Capped: 0 ---

      at SettlementJob.executeWhaleTrimBack (src/jobs/settlement.job.js:77:21)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:24:29.118Z - [INFO]: Settlement Finalized. Total Refunded: 0 | Accounts Capped: 0
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

FAIL test/integration/payout.pipeline.test.js (9.886 s)
  Payout Pipeline - End-to-End Financial Integration
    ✕ Vesting Flow: Successful Pi transfer should update the investor ledger (1637 ms)
    ✓ Resilience: Database should not update if the Payout Service fails (718 ms)

  ● Payout Pipeline - End-to-End Financial Integration › Vesting Flow: Successful Pi transfer should update the investor ledger

    expect(jest.fn()).toHaveBeenCalled()

    Expected number of calls: >= 1
    Received number of calls:    0

      102 |     // Assertions: Validate HTTP status (200 OK or 201 Created)
      103 |     expect(response.status).toBeLessThan(400); 
    > 104 |     expect(paymentSpy).toHaveBeenCalled();
          |                        ^
      105 |     // Ensuring the ledger reflects the progression
      106 |     expect(updatedPioneer.vestingMonthsCompleted).toBe(1);
      107 |   });

      at Object.<anonymous> (test/integration/payout.pipeline.test.js:104:24)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:24:32.403Z - [INFO]: MapCap Audit Engine v1.5.5 Synchronized for Cloud Deployment.
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    🛑 TEST_ENGINE_OFFLINE: Resources deallocated.

      at Object.<anonymous> (test/setup.js:83:13)

FAIL test/unit/utils/system.health.test.js (5.548 s)
  System Health & Cloud Infrastructure - Unit Tests
    Server Engine - Heartbeat Integration
      ✕ Heartbeat: GET / should return 200 and live financial metrics for UI (693 ms)
      ✓ Security: Should verify CORS headers for cross-origin dashboard access (187 ms)
    Audit Logger - Transparency & Alerts
      ✓ INFO Logs: Should format operational entries with [AUDIT_INFO] tag (134 ms)
      ✓ CRITICAL Alerts: Should elevate priority for security/pipeline failures (139 ms)
    Vercel Config - Serverless Security
      ✓ Security: Should enforce no-store headers to prevent stale financial data (130 ms)
      ✓ Environment: Should enable experimental-modules for Node runtime support (128 ms)

  ● System Health & Cloud Infrastructure - Unit Tests › Server Engine - Heartbeat Integration › Heartbeat: GET / should return 200 and live financial metrics for UI

    TypeError: Cannot read properties of undefined (reading 'total_pi_invested')

      52 |       expect(res.statusCode).toEqual(200);
      53 |       expect(res.body.success).toBe(true);
    > 54 |       expect(res.body.data.live_metrics.total_pi_invested).toBe(1000000);
         |                                         ^
      55 |       
      56 |       aggregateSpy.mockRestore();
      57 |     });

      at Object.<anonymous> (test/unit/utils/system.health.test.js:54:41)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:24:37.262Z - [INFO]: MapCap Audit Engine v1.5.5 Synchronized for Cloud Deployment.
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    
    ✅ TEST_ENGINE_READY: Connected to Remote Atlas

      at Object.<anonymous> (test/setup.js:43:15)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:24:39.441Z - [INFO]: Investment Success: 750.55 Pi | Tx: TX_ID_999_INTEGRATION_TEST | Pioneer: GBVXXXX_TEST_PIONEER_NODE
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:24:40.457Z - [INFO]: Investment Success: 100 Pi | Tx: STRICTLY_UNIQUE_TX_101 | Pioneer: PIONEER_UNIQUE_STAKE
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T19:24:40.639Z - [ERROR]: [ERR-MLPKCQWV-7DX] Code: 409 | Message: Duplicate Entry: This transaction has already been synchronized.
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at writeAuditLog (src/config/logger.js:66:17)
      at ResponseHelper.error (src/utils/response.helper.js:57:7)
      at processInvestment (src/controllers/payment.controller.js:45:39)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T19:24:41.140Z - [ERROR]: [ERR-MLPKCRAS-3XB] Code: 400 | Message: Missing Metadata: Transaction credentials (Address/Amount/TXID) are required.
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at writeAuditLog (src/config/logger.js:66:17)
      at ResponseHelper.error (src/utils/response.helper.js:57:7)
      at processInvestment (src/controllers/payment.controller.js:35:35)
      at Layer.handle [as handle_request] (node_modules/express/lib/router/layer.js:95:5)
      at next (node_modules/express/lib/router/route.js:149:13)
      at Route.dispatch (node_modules/express/lib/router/route.js:119:3)
      at Layer.handle [as handle_request] (node_modules/express/lib/router/layer.js:95:5)
      at node_modules/express/lib/router/index.js:284:15
      at router.process_params (node_modules/express/lib/router/index.js:346:12)
      at next (node_modules/express/lib/router/index.js:280:10)
      at router.handle (node_modules/express/lib/router/index.js:175:3)
      at router (node_modules/express/lib/router/index.js:47:12)
      at Layer.handle [as handle_request] (node_modules/express/lib/router/layer.js:95:5)
      at trim_prefix (node_modules/express/lib/router/index.js:328:13)
      at node_modules/express/lib/router/index.js:286:9
      at router.process_params (node_modules/express/lib/router/index.js:346:12)
      at next (node_modules/express/lib/router/index.js:280:10)
      at router.handle (node_modules/express/lib/router/index.js:175:3)
      at router (node_modules/express/lib/router/index.js:47:12)
      at Layer.handle [as handle_request] (node_modules/express/lib/router/layer.js:95:5)
      at trim_prefix (node_modules/express/lib/router/index.js:328:13)
      at node_modules/express/lib/router/index.js:286:9
      at router.process_params (node_modules/express/lib/router/index.js:346:12)
      at next (node_modules/express/lib/router/index.js:280:10)
      at cors (node_modules/cors/lib/index.js:188:7)
      at node_modules/cors/lib/index.js:224:17
      at originCallback (node_modules/cors/lib/index.js:214:15)
      at node_modules/cors/lib/index.js:219:13
      at optionsCallback (node_modules/cors/lib/index.js:199:9)
      at corsMiddleware (node_modules/cors/lib/index.js:204:7)
      at Layer.handle [as handle_request] (node_modules/express/lib/router/layer.js:95:5)
      at trim_prefix (node_modules/express/lib/router/index.js:328:13)
      at node_modules/express/lib/router/index.js:286:9
      at router.process_params (node_modules/express/lib/router/index.js:346:12)
      at next (node_modules/express/lib/router/index.js:280:10)
      at node_modules/body-parser/lib/read.js:137:5
      at invokeCallback (node_modules/raw-body/index.js:238:16)
      at done (node_modules/raw-body/index.js:227:7)
      at IncomingMessage.onEnd (node_modules/raw-body/index.js:287:7)

PASS test/integration/ipo.contribution.test.js (6.394 s)
  IPO Contribution Pipeline - End-to-End Integration
    ✓ Success: POST /api/v1/ipo/invest should persist high-fidelity data and return 200 OK (1515 ms)
    ✓ Security: Should trigger 409 Conflict when a duplicate piTxId is detected (1050 ms)
    ✓ Guard: Should reject malformed requests missing critical blockchain metadata (442 ms)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:24:43.654Z - [INFO]: MapCap Audit Engine v1.5.5 Synchronized for Cloud Deployment.
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    
    ✅ TEST_ENGINE_READY: Connected to Remote Atlas

      at Object.<anonymous> (test/setup.js:43:15)

  console.warn
    [SECURITY_ALERT] Unauthorized Admin access blocked | IP: ::ffff:127.0.0.1 | Ref: MAPCAP-SEC-DI74L

      53 |      */
      54 |     const auditRef = `MAPCAP-SEC-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    > 55 |     console.warn(`[SECURITY_ALERT] Unauthorized Admin access blocked | IP: ${req.ip} | Ref: ${auditRef}`);
         |             ^
      56 |
      57 |     return res.status(403).json({ 
      58 |         success: false, 

      at adminAuth (src/middlewares/auth.middleware.js:55:13)
      at Layer.handle [as handle_request] (node_modules/express/lib/router/layer.js:95:5)
      at next (node_modules/express/lib/router/route.js:149:13)
      at Route.dispatch (node_modules/express/lib/router/route.js:119:3)
      at Layer.handle [as handle_request] (node_modules/express/lib/router/layer.js:95:5)
      at node_modules/express/lib/router/index.js:284:15
      at router.process_params (node_modules/express/lib/router/index.js:346:12)
      at next (node_modules/express/lib/router/index.js:280:10)
      at router.handle (node_modules/express/lib/router/index.js:175:3)
      at router (node_modules/express/lib/router/index.js:47:12)
      at Layer.handle [as handle_request] (node_modules/express/lib/router/layer.js:95:5)
      at trim_prefix (node_modules/express/lib/router/index.js:328:13)
      at node_modules/express/lib/router/index.js:286:9
      at router.process_params (node_modules/express/lib/router/index.js:346:12)
      at next (node_modules/express/lib/router/index.js:280:10)
      at node_modules/express/lib/router/index.js:646:15
      at next (node_modules/express/lib/router/index.js:265:14)
      at router.handle (node_modules/express/lib/router/index.js:175:3)
      at router (node_modules/express/lib/router/index.js:47:12)
      at Layer.handle [as handle_request] (node_modules/express/lib/router/layer.js:95:5)
      at trim_prefix (node_modules/express/lib/router/index.js:328:13)
      at node_modules/express/lib/router/index.js:286:9
      at router.process_params (node_modules/express/lib/router/index.js:346:12)
      at next (node_modules/express/lib/router/index.js:280:10)
      at node_modules/express/lib/router/index.js:646:15
      at next (node_modules/express/lib/router/index.js:265:14)
      at router.handle (node_modules/express/lib/router/index.js:175:3)
      at router (node_modules/express/lib/router/index.js:47:12)
      at Layer.handle [as handle_request] (node_modules/express/lib/router/layer.js:95:5)
      at trim_prefix (node_modules/express/lib/router/index.js:328:13)
      at node_modules/express/lib/router/index.js:286:9
      at router.process_params (node_modules/express/lib/router/index.js:346:12)
      at next (node_modules/express/lib/router/index.js:280:10)
      at cors (node_modules/cors/lib/index.js:188:7)
      at node_modules/cors/lib/index.js:224:17
      at originCallback (node_modules/cors/lib/index.js:214:15)
      at node_modules/cors/lib/index.js:219:13
      at optionsCallback (node_modules/cors/lib/index.js:199:9)
      at corsMiddleware (node_modules/cors/lib/index.js:204:7)
      at Layer.handle [as handle_request] (node_modules/express/lib/router/layer.js:95:5)
      at trim_prefix (node_modules/express/lib/router/index.js:328:13)
      at node_modules/express/lib/router/index.js:286:9
      at router.process_params (node_modules/express/lib/router/index.js:346:12)
      at next (node_modules/express/lib/router/index.js:280:10)
      at jsonParser (node_modules/body-parser/lib/types/json.js:113:7)
      at Layer.handle [as handle_request] (node_modules/express/lib/router/layer.js:95:5)
      at trim_prefix (node_modules/express/lib/router/index.js:328:13)
      at node_modules/express/lib/router/index.js:286:9
      at router.process_params (node_modules/express/lib/router/index.js:346:12)
      at next (node_modules/express/lib/router/index.js:280:10)
      at logger (node_modules/morgan/index.js:144:5)
      at Layer.handle [as handle_request] (node_modules/express/lib/router/layer.js:95:5)
      at trim_prefix (node_modules/express/lib/router/index.js:328:13)
      at node_modules/express/lib/router/index.js:286:9
      at router.process_params (node_modules/express/lib/router/index.js:346:12)
      at next (node_modules/express/lib/router/index.js:280:10)
      at expressInit (node_modules/express/lib/middleware/init.js:40:5)
      at Layer.handle [as handle_request] (node_modules/express/lib/router/layer.js:95:5)
      at trim_prefix (node_modules/express/lib/router/index.js:328:13)
      at node_modules/express/lib/router/index.js:286:9
      at router.process_params (node_modules/express/lib/router/index.js:346:12)
      at next (node_modules/express/lib/router/index.js:280:10)
      at query (node_modules/express/lib/middleware/query.js:45:5)
      at Layer.handle [as handle_request] (node_modules/express/lib/router/layer.js:95:5)
      at trim_prefix (node_modules/express/lib/router/index.js:328:13)
      at node_modules/express/lib/router/index.js:286:9
      at router.process_params (node_modules/express/lib/router/index.js:346:12)
      at next (node_modules/express/lib/router/index.js:280:10)
      at router.handle (node_modules/express/lib/router/index.js:175:3)
      at app.handle (node_modules/express/lib/application.js:181:10)
      at Server.app (node_modules/express/lib/express.js:39:9)

  console.log
    [SECURITY_LOG] Admin Privilege Elevated | Time: 2026-02-16T19:24:46.460Z | IP: ::ffff:127.0.0.1

      at adminAuth (src/middlewares/auth.middleware.js:45:17)

  console.log
    [ADMIN_ACTION] Manual Post-IPO Settlement sequence initiated at 2026-02-16T19:24:46.469Z

      at triggerFinalSettlement (src/controllers/admin/admin.controller.js:31:21)

  console.log
    --- [COMPLIANCE] Initiating Post-IPO Final Settlement Sequence ---

      at SettlementJob.executeWhaleTrimBack (src/jobs/settlement.job.js:29:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:24:46.568Z - [INFO]: Whale Settlement Triggered. Final Water-Level: 20000 Pi
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.warn
    [WHALE_CAP_TRIGGERED] Wallet: PIONEER_SETTLE_TEST_001 | Surplus: 18000 Pi

      50 |                 if (preciseRefund <= 0) continue;
      51 |
    > 52 |                 console.warn(`[WHALE_CAP_TRIGGERED] Wallet: ${investor.piAddress} | Surplus: ${preciseRefund} Pi`);
         |                         ^
      53 |
      54 |                 try {
      55 |                     /**

      at SettlementJob.executeWhaleTrimBack (src/jobs/settlement.job.js:52:25)
      at triggerFinalSettlement (src/controllers/admin/admin.controller.js:63:28)

  console.error
    [CRITICAL_A2U_FAILURE]: getaddrinfo ENOTFOUND api.escrowpi.com

      73 |              */
      74 |             const errorDetails = error.response?.data || error.message;
    > 75 |             console.error("[CRITICAL_A2U_FAILURE]:", errorDetails);
         |                     ^
      76 |             
      77 |             // Critical failures are thrown to stop automated jobs and prevent inconsistent states
      78 |             throw new Error(`A2UaaS pipeline disrupted: ${JSON.stringify(errorDetails)}`);

      at PayoutService.executeA2UPayout (src/services/payout.service.js:75:21)
      at SettlementJob.executeWhaleTrimBack (src/jobs/settlement.job.js:59:21)
      at triggerFinalSettlement (src/controllers/admin/admin.controller.js:63:28)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T19:24:46.738Z - [CRITICAL]: PAYOUT_FAILED for PIONEER_SETTLE_TEST_001: A2UaaS pipeline disrupted: "getaddrinfo ENOTFOUND api.escrowpi.com"
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at writeAuditLog (src/config/logger.js:66:17)
      at SettlementJob.executeWhaleTrimBack (src/jobs/settlement.job.js:72:21)
      at triggerFinalSettlement (src/controllers/admin/admin.controller.js:63:28)

  console.error
    [CRITICAL_FAILURE] Settlement execution error for PIONEER_SETTLE_TEST_001

      71 |                 } catch (payoutError) {
      72 |                     writeAuditLog('CRITICAL', `PAYOUT_FAILED for ${investor.piAddress}: ${payoutError.message}`);
    > 73 |                     console.error(`[CRITICAL_FAILURE] Settlement execution error for ${investor.piAddress}`);
         |                             ^
      74 |                 }
      75 |             }
      76 |

      at SettlementJob.executeWhaleTrimBack (src/jobs/settlement.job.js:73:29)
      at triggerFinalSettlement (src/controllers/admin/admin.controller.js:63:28)

  console.log
    --- [SUMMARY] Settlement Finalized. Total Refunded: 0 | Accounts Capped: 0 ---

      at SettlementJob.executeWhaleTrimBack (src/jobs/settlement.job.js:77:21)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:24:46.745Z - [INFO]: Settlement Finalized. Total Refunded: 0 | Accounts Capped: 0
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    [SECURITY_LOG] Admin Privilege Elevated | Time: 2026-02-16T19:24:47.093Z | IP: ::ffff:127.0.0.1

      at adminAuth (src/middlewares/auth.middleware.js:45:17)

PASS test/integration/admin.ops.test.js (5.91 s)
  Admin Operations - Security & Settlement Integration
    ✓ Security: GET /api/v1/admin/audit-logs should reject unauthenticated requests (1387 ms)
    ✓ Settlement: POST /api/v1/admin/settle should execute with a valid admin token (782 ms)
    ✓ Audit: GET /api/v1/admin/status should return system metrics for real-time review (351 ms)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:24:49.255Z - [INFO]: MapCap Audit Engine v1.5.5 Synchronized for Cloud Deployment.
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    
    ✅ TEST_ENGINE_READY: Connected to Remote Atlas

      at Object.<anonymous> (test/setup.js:43:15)

  console.log
    --- [MARKET_ENGINE] Starting Daily Price Recalibration Cycle ---

      at DailyPriceJob.updatePrice (src/jobs/daily-price-update.js:26:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:24:50.329Z - [INFO]: [MARKET_SNAPSHOT] Pool: 100000 Pi | Spot Price: 21.818180
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    [AUDIT] Current Water-Level: 100000 Pi

      at DailyPriceJob.updatePrice (src/jobs/daily-price-update.js:54:21)

  console.log
    [AUDIT] Market Spot Price: 21.818180

      at DailyPriceJob.updatePrice (src/jobs/daily-price-update.js:55:21)

  console.log
    --- [SUCCESS] Market Recalibration Cycle Finalized ---

      at DailyPriceJob.updatePrice (src/jobs/daily-price-update.js:62:21)

  console.log
    --- [MARKET_ENGINE] Starting Daily Price Recalibration Cycle ---

      at DailyPriceJob.updatePrice (src/jobs/daily-price-update.js:26:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:24:50.861Z - [INFO]: [MARKET_SNAPSHOT] Pool: 0 Pi | Spot Price: 0.000000
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    [AUDIT] Current Water-Level: 0 Pi

      at DailyPriceJob.updatePrice (src/jobs/daily-price-update.js:54:21)

  console.log
    [AUDIT] Market Spot Price: 0.000000

      at DailyPriceJob.updatePrice (src/jobs/daily-price-update.js:55:21)

  console.log
    --- [SUCCESS] Market Recalibration Cycle Finalized ---

      at DailyPriceJob.updatePrice (src/jobs/daily-price-update.js:62:21)

  console.log
    --- [MARKET_ENGINE] Starting Daily Price Recalibration Cycle ---

      at DailyPriceJob.updatePrice (src/jobs/daily-price-update.js:26:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:24:51.054Z - [INFO]: [MARKET_SNAPSHOT] Pool: 100000 Pi | Spot Price: 21.818180
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    [AUDIT] Current Water-Level: 100000 Pi

      at DailyPriceJob.updatePrice (src/jobs/daily-price-update.js:54:21)

  console.log
    [AUDIT] Market Spot Price: 21.818180

      at DailyPriceJob.updatePrice (src/jobs/daily-price-update.js:55:21)

  console.log
    --- [SUCCESS] Market Recalibration Cycle Finalized ---

      at DailyPriceJob.updatePrice (src/jobs/daily-price-update.js:62:21)

  console.log
    --- [SYSTEM] Cron Scheduler Engine Initialized (UTC Mode) ---

      at CronScheduler.init (src/jobs/cron.scheduler.js:27:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:24:51.224Z - [INFO]: Cron Scheduler Engine Online.
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    --- [SYSTEM] Cron Scheduler Engine Initialized (UTC Mode) ---

      at CronScheduler.init (src/jobs/cron.scheduler.js:27:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:24:51.378Z - [INFO]: Cron Scheduler Engine Online.
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    --- [SYSTEM] Cron Scheduler Engine Initialized (UTC Mode) ---

      at CronScheduler.init (src/jobs/cron.scheduler.js:27:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:24:51.515Z - [INFO]: Cron Scheduler Engine Online.
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    --- [SYSTEM] Cron Scheduler Engine Initialized (UTC Mode) ---

      at CronScheduler.init (src/jobs/cron.scheduler.js:27:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:24:51.658Z - [INFO]: Cron Scheduler Engine Online.
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    🛑 TEST_ENGINE_OFFLINE: Resources deallocated.

      at Object.<anonymous> (test/setup.js:83:13)

PASS test/unit/jobs/daily_price.job.test.js
  Daily Automation & Market Logic - Unit Tests
    Daily Price Job - Financial Precision
      ✓ Recalibration: Should calculate correct spot price with 6-decimal precision (532 ms)
      ✓ Safety: Should return a 0.000000 price when total liquidity is zero (189 ms)
      ✓ Audit: Should include a valid ISO timestamp for the price snapshot (160 ms)
    Cron Scheduler - Task Orchestration
      ✓ Orchestration: Should initialize exactly 3 core automated tasks on boot (162 ms)
      ✓ Scheduling: Daily Price Job must be set for Midnight UTC (134 ms)
      ✓ Scheduling: Monthly Vesting must be set for the 1st of each month (137 ms)
      ✓ Scheduling: Final Whale Settlement must trigger on the 28th day (153 ms)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:24:53.575Z - [INFO]: MapCap Audit Engine v1.5.5 Synchronized for Cloud Deployment.
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    
    ✅ TEST_ENGINE_READY: Connected to Remote Atlas

      at Object.<anonymous> (test/setup.js:43:15)

  console.log
    --- [FINANCIAL_JOB] Initiating Monthly Dividend Distribution ---

      at DividendJob.distributeDividends (src/jobs/dividend.job.js:25:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:24:55.646Z - [INFO]: Dividend Cycle Started. Total Pot: 10000 Pi
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T19:24:55.651Z - [WARN]: Anti-Whale Ceiling hit for Whale_Pioneer. Payout capped at 1000 Pi.
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at writeAuditLog (src/config/logger.js:66:17)
      at DividendJob.distributeDividends (src/jobs/dividend.job.js:57:21)
      at Object.<anonymous> (test/unit/jobs/dividend.job.test.js:70:7)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:24:55.654Z - [INFO]: Dividend Cycle Finalized. Total Pi Dispatched: 1100
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    --- [SUCCESS] Distribution Cycle Complete. Total: 1100 Pi ---

      at DividendJob.distributeDividends (src/jobs/dividend.job.js:77:21)

  console.log
    --- [FINANCIAL_JOB] Initiating Monthly Dividend Distribution ---

      at DividendJob.distributeDividends (src/jobs/dividend.job.js:25:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:24:55.790Z - [INFO]: Dividend Cycle Started. Total Pot: 10000 Pi
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T19:24:55.795Z - [WARN]: Anti-Whale Ceiling hit for Whale_Pioneer. Payout capped at 1000 Pi.
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at writeAuditLog (src/config/logger.js:66:17)
      at DividendJob.distributeDividends (src/jobs/dividend.job.js:57:21)
      at Object.<anonymous> (test/unit/jobs/dividend.job.test.js:84:7)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:24:55.798Z - [INFO]: Dividend Cycle Finalized. Total Pi Dispatched: 1100
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    --- [SUCCESS] Distribution Cycle Complete. Total: 1100 Pi ---

      at DividendJob.distributeDividends (src/jobs/dividend.job.js:77:21)

  console.log
    --- [FINANCIAL_JOB] Initiating Monthly Dividend Distribution ---

      at DividendJob.distributeDividends (src/jobs/dividend.job.js:25:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:24:55.930Z - [INFO]: Dividend Cycle Started. Total Pot: 10000 Pi
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T19:24:55.935Z - [CRITICAL]: Dividend Transfer FAILED for Normal_Pioneer: Network Timeout
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at writeAuditLog (src/config/logger.js:66:17)
      at DividendJob.distributeDividends (src/jobs/dividend.job.js:71:25)
      at Object.<anonymous> (test/unit/jobs/dividend.job.test.js:99:7)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T19:24:55.937Z - [WARN]: Anti-Whale Ceiling hit for Whale_Pioneer. Payout capped at 1000 Pi.
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at writeAuditLog (src/config/logger.js:66:17)
      at DividendJob.distributeDividends (src/jobs/dividend.job.js:57:21)
      at Object.<anonymous> (test/unit/jobs/dividend.job.test.js:99:7)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:24:55.940Z - [INFO]: Dividend Cycle Finalized. Total Pi Dispatched: 1000
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    --- [SUCCESS] Distribution Cycle Complete. Total: 1000 Pi ---

      at DividendJob.distributeDividends (src/jobs/dividend.job.js:77:21)

  console.log
    🛑 TEST_ENGINE_OFFLINE: Resources deallocated.

      at Object.<anonymous> (test/setup.js:83:13)

PASS test/unit/jobs/dividend.job.test.js
  Tokenomics & Dividends - Unified Financial Tests
    Mint Configuration - Scarcity & Balance
      ✓ Supply: Should enforce 4M Hard-Cap and 2.18M IPO Pool target (506 ms)
      ✓ Balance: IPO and LP pools must mathematically equal the total mint (147 ms)
      ✓ Precision: Should strictly follow the 6-decimal global financial standard (124 ms)
      ✓ Security: Mint configuration object must be frozen at runtime (125 ms)
    Dividend Job - Proportional Payouts
      ✓ Distribution: Should calculate 1% share accurately for normal pioneers (146 ms)
      ✓ Anti-Whale: Should truncate whale dividends at 10% of the profit pot (137 ms)
      ✓ Fault Tolerance: Should continue processing if a single payment fails (143 ms)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:24:57.834Z - [INFO]: MapCap Audit Engine v1.5.5 Synchronized for Cloud Deployment.
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    
    ✅ TEST_ENGINE_READY: Connected to Remote Atlas

      at Object.<anonymous> (test/setup.js:43:15)

  console.log
    --- [COMPLIANCE] Initiating Post-IPO Final Settlement Sequence ---

      at SettlementJob.executeWhaleTrimBack (src/jobs/settlement.job.js:29:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:24:58.995Z - [INFO]: Whale Settlement Triggered. Final Water-Level: 100000 Pi
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.warn
    [WHALE_CAP_TRIGGERED] Wallet: Whale_001 | Surplus: 5000.555555 Pi

      50 |                 if (preciseRefund <= 0) continue;
      51 |
    > 52 |                 console.warn(`[WHALE_CAP_TRIGGERED] Wallet: ${investor.piAddress} | Surplus: ${preciseRefund} Pi`);
         |                         ^
      53 |
      54 |                 try {
      55 |                     /**

      at SettlementJob.executeWhaleTrimBack (src/jobs/settlement.job.js:52:25)
      at Object.<anonymous> (test/unit/jobs/settlement.job.test.js:56:22)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:24:59.002Z - [INFO]: Settlement Success: 5000.555555 Pi returned to Whale_001.
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    --- [SUMMARY] Settlement Finalized. Total Refunded: 5000.555555 | Accounts Capped: 1 ---

      at SettlementJob.executeWhaleTrimBack (src/jobs/settlement.job.js:77:21)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:24:59.007Z - [INFO]: Settlement Finalized. Total Refunded: 5000.555555 | Accounts Capped: 1
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    --- [COMPLIANCE] Initiating Post-IPO Final Settlement Sequence ---

      at SettlementJob.executeWhaleTrimBack (src/jobs/settlement.job.js:29:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:24:59.610Z - [INFO]: Whale Settlement Triggered. Final Water-Level: 100000 Pi
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.warn
    [WHALE_CAP_TRIGGERED] Wallet: Whale_A | Surplus: 2000 Pi

      50 |                 if (preciseRefund <= 0) continue;
      51 |
    > 52 |                 console.warn(`[WHALE_CAP_TRIGGERED] Wallet: ${investor.piAddress} | Surplus: ${preciseRefund} Pi`);
         |                         ^
      53 |
      54 |                 try {
      55 |                     /**

      at SettlementJob.executeWhaleTrimBack (src/jobs/settlement.job.js:52:25)
      at Object.<anonymous> (test/unit/jobs/settlement.job.test.js:81:22)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:24:59.620Z - [INFO]: Settlement Success: 2000 Pi returned to Whale_A.
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.warn
    [WHALE_CAP_TRIGGERED] Wallet: Whale_B | Surplus: 3000 Pi

      50 |                 if (preciseRefund <= 0) continue;
      51 |
    > 52 |                 console.warn(`[WHALE_CAP_TRIGGERED] Wallet: ${investor.piAddress} | Surplus: ${preciseRefund} Pi`);
         |                         ^
      53 |
      54 |                 try {
      55 |                     /**

      at SettlementJob.executeWhaleTrimBack (src/jobs/settlement.job.js:52:25)
      at Object.<anonymous> (test/unit/jobs/settlement.job.test.js:81:22)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:24:59.626Z - [INFO]: Settlement Success: 3000 Pi returned to Whale_B.
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    --- [SUMMARY] Settlement Finalized. Total Refunded: 5000 | Accounts Capped: 2 ---

      at SettlementJob.executeWhaleTrimBack (src/jobs/settlement.job.js:77:21)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:24:59.630Z - [INFO]: Settlement Finalized. Total Refunded: 5000 | Accounts Capped: 2
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    🕒 --- [VESTING_ENGINE] Monthly Distribution Cycle Started ---

      at VestingJob.executeMonthlyVesting (src/jobs/vesting.job.js:27:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:24:59.803Z - [INFO]: Vesting Engine: Monthly Tranche Release Initiated.
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:24:59.814Z - [INFO]: [TRANCHE_RELEASED] 1/10 to Pioneer_001
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    🏁 --- [SUCCESS] Monthly Vesting Cycle Finalized ---

      at VestingJob.executeMonthlyVesting (src/jobs/vesting.job.js:77:21)

  console.log
    🕒 --- [VESTING_ENGINE] Monthly Distribution Cycle Started ---

      at VestingJob.executeMonthlyVesting (src/jobs/vesting.job.js:27:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:25:00.028Z - [INFO]: Vesting Engine: Monthly Tranche Release Initiated.
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    ℹ️ [SYSTEM] Idle State: No pending vesting tranches detected.

      at VestingJob.executeMonthlyVesting (src/jobs/vesting.job.js:43:25)

  console.log
    --- [COMPLIANCE] Initiating Post-IPO Final Settlement Sequence ---

      at SettlementJob.executeWhaleTrimBack (src/jobs/settlement.job.js:29:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:25:00.219Z - [INFO]: Whale Settlement Triggered. Final Water-Level: 100000 Pi
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.warn
    [WHALE_CAP_TRIGGERED] Wallet: Whale_Fail | Surplus: 10000 Pi

      50 |                 if (preciseRefund <= 0) continue;
      51 |
    > 52 |                 console.warn(`[WHALE_CAP_TRIGGERED] Wallet: ${investor.piAddress} | Surplus: ${preciseRefund} Pi`);
         |                         ^
      53 |
      54 |                 try {
      55 |                     /**

      at SettlementJob.executeWhaleTrimBack (src/jobs/settlement.job.js:52:25)
      at Object.<anonymous> (test/unit/jobs/settlement.job.test.js:147:7)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T19:25:00.230Z - [CRITICAL]: PAYOUT_FAILED for Whale_Fail: A2U Gateway Timeout
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at writeAuditLog (src/config/logger.js:66:17)
      at SettlementJob.executeWhaleTrimBack (src/jobs/settlement.job.js:72:21)
      at Object.<anonymous> (test/unit/jobs/settlement.job.test.js:147:7)

  console.error
    [CRITICAL_FAILURE] Settlement execution error for Whale_Fail

      71 |                 } catch (payoutError) {
      72 |                     writeAuditLog('CRITICAL', `PAYOUT_FAILED for ${investor.piAddress}: ${payoutError.message}`);
    > 73 |                     console.error(`[CRITICAL_FAILURE] Settlement execution error for ${investor.piAddress}`);
         |                             ^
      74 |                 }
      75 |             }
      76 |

      at SettlementJob.executeWhaleTrimBack (src/jobs/settlement.job.js:73:29)
      at Object.<anonymous> (test/unit/jobs/settlement.job.test.js:147:7)

  console.warn
    [WHALE_CAP_TRIGGERED] Wallet: Whale_Success | Surplus: 10000 Pi

      50 |                 if (preciseRefund <= 0) continue;
      51 |
    > 52 |                 console.warn(`[WHALE_CAP_TRIGGERED] Wallet: ${investor.piAddress} | Surplus: ${preciseRefund} Pi`);
         |                         ^
      53 |
      54 |                 try {
      55 |                     /**

      at SettlementJob.executeWhaleTrimBack (src/jobs/settlement.job.js:52:25)
      at Object.<anonymous> (test/unit/jobs/settlement.job.test.js:147:7)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:25:00.241Z - [INFO]: Settlement Success: 10000 Pi returned to Whale_Success.
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    --- [SUMMARY] Settlement Finalized. Total Refunded: 10000 | Accounts Capped: 1 ---

      at SettlementJob.executeWhaleTrimBack (src/jobs/settlement.job.js:77:21)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:25:00.244Z - [INFO]: Settlement Finalized. Total Refunded: 10000 | Accounts Capped: 1
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    🕒 --- [VESTING_ENGINE] Monthly Distribution Cycle Started ---

      at VestingJob.executeMonthlyVesting (src/jobs/vesting.job.js:27:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:25:00.435Z - [INFO]: Vesting Engine: Monthly Tranche Release Initiated.
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    🏁 --- [SUCCESS] Monthly Vesting Cycle Finalized ---

      at VestingJob.executeMonthlyVesting (src/jobs/vesting.job.js:77:21)

  console.log
    🛑 TEST_ENGINE_OFFLINE: Resources deallocated.

      at Object.<anonymous> (test/setup.js:83:13)

PASS test/unit/jobs/settlement.job.test.js
  Financial Lifecycle - Settlement & Vesting Unified Tests
    Whale Trim-Back - Precision & Enforcement
      ✓ Precision: Should refund excess Pi with 6-decimal floor truncation (608 ms)
      ✓ Aggregation: Should track total refunded Pi across multiple whales (178 ms)
    Monthly Vesting - Release Logic
      ✓ Calculation: Should release exactly 10% of allocated equity per month (217 ms)
      ✓ Security: Should strictly exclude whales from the vesting distribution queue (203 ms)
    System Fault Tolerance
      ✓ Recovery: Should maintain queue processing if a single payout fails (195 ms)
      ✓ Atomicity: Should not increment vesting state if Pi transfer fails (213 ms)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:25:03.050Z - [INFO]: MapCap Audit Engine v1.5.5 Synchronized for Cloud Deployment.
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    
    ✅ TEST_ENGINE_READY: Connected to Remote Atlas

      at Object.<anonymous> (test/setup.js:43:15)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T19:25:05.446Z - [ERROR]: [ERR-MLPKDA1Y-7K7] Code: 500 | Message: Global Sync Failure: Engine Failure
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at writeAuditLog (src/config/logger.js:66:17)
      at ResponseHelper.error (src/utils/response.helper.js:57:7)
      at src/routes/api.js:60:31
      at Layer.handle [as handle_request] (node_modules/express/lib/router/layer.js:95:5)
      at next (node_modules/express/lib/router/route.js:149:13)
      at Route.dispatch (node_modules/express/lib/router/route.js:119:3)
      at Layer.handle [as handle_request] (node_modules/express/lib/router/layer.js:95:5)
      at node_modules/express/lib/router/index.js:284:15
      at router.process_params (node_modules/express/lib/router/index.js:346:12)
      at next (node_modules/express/lib/router/index.js:280:10)
      at router.handle (node_modules/express/lib/router/index.js:175:3)
      at router (node_modules/express/lib/router/index.js:47:12)
      at Layer.handle [as handle_request] (node_modules/express/lib/router/layer.js:95:5)
      at trim_prefix (node_modules/express/lib/router/index.js:328:13)
      at node_modules/express/lib/router/index.js:286:9
      at router.process_params (node_modules/express/lib/router/index.js:346:12)
      at next (node_modules/express/lib/router/index.js:280:10)
      at cors (node_modules/cors/lib/index.js:188:7)
      at node_modules/cors/lib/index.js:224:17
      at originCallback (node_modules/cors/lib/index.js:214:15)
      at node_modules/cors/lib/index.js:219:13
      at optionsCallback (node_modules/cors/lib/index.js:199:9)
      at corsMiddleware (node_modules/cors/lib/index.js:204:7)
      at Layer.handle [as handle_request] (node_modules/express/lib/router/layer.js:95:5)
      at trim_prefix (node_modules/express/lib/router/index.js:328:13)
      at node_modules/express/lib/router/index.js:286:9
      at router.process_params (node_modules/express/lib/router/index.js:346:12)
      at next (node_modules/express/lib/router/index.js:280:10)
      at jsonParser (node_modules/body-parser/lib/types/json.js:113:7)
      at Layer.handle [as handle_request] (node_modules/express/lib/router/layer.js:95:5)
      at trim_prefix (node_modules/express/lib/router/index.js:328:13)
      at node_modules/express/lib/router/index.js:286:9
      at router.process_params (node_modules/express/lib/router/index.js:346:12)
      at next (node_modules/express/lib/router/index.js:280:10)
      at logger (node_modules/morgan/index.js:144:5)
      at Layer.handle [as handle_request] (node_modules/express/lib/router/layer.js:95:5)
      at trim_prefix (node_modules/express/lib/router/index.js:328:13)
      at node_modules/express/lib/router/index.js:286:9
      at router.process_params (node_modules/express/lib/router/index.js:346:12)
      at next (node_modules/express/lib/router/index.js:280:10)
      at expressInit (node_modules/express/lib/middleware/init.js:40:5)
      at Layer.handle [as handle_request] (node_modules/express/lib/router/layer.js:95:5)
      at trim_prefix (node_modules/express/lib/router/index.js:328:13)
      at node_modules/express/lib/router/index.js:286:9
      at router.process_params (node_modules/express/lib/router/index.js:346:12)
      at next (node_modules/express/lib/router/index.js:280:10)
      at query (node_modules/express/lib/middleware/query.js:45:5)
      at Layer.handle [as handle_request] (node_modules/express/lib/router/layer.js:95:5)
      at trim_prefix (node_modules/express/lib/router/index.js:328:13)
      at node_modules/express/lib/router/index.js:286:9
      at router.process_params (node_modules/express/lib/router/index.js:346:12)
      at next (node_modules/express/lib/router/index.js:280:10)
      at router.handle (node_modules/express/lib/router/index.js:175:3)
      at app.handle (node_modules/express/lib/application.js:181:10)
      at Server.app (node_modules/express/lib/express.js:39:9)

PASS test/integration/metrics.sync.test.js (5.159 s)
  Metrics Synchronization - System Pulse Integration
    ✓ Sync: Should return synchronized global pulse with scarcity metrics (1110 ms)
    ✓ Resilience: Should return 500 error if the Scarcity Engine fails (503 ms)

  console.log
    
    ✅ TEST_ENGINE_READY: Connected to Remote Atlas

      at Object.<anonymous> (test/setup.js:43:15)

  console.log
    🛑 TEST_ENGINE_OFFLINE: Resources deallocated.

      at Object.<anonymous> (test/setup.js:83:13)

PASS test/unit/models/transaction.model.test.js
  Transaction Model - Unified Audit Trail Integrity
    Mandatory Metadata & Financial Guards
      ✓ Validation: Should reject transactions missing address, amount, or type (557 ms)
      ✓ Financials: Should strictly reject negative transaction amounts (73 ms)
    Whale-Shield Compatibility & Lifecycle
      ✓ Compliance: Should support REFUND type for post-IPO ceiling adjustments (72 ms)
      ✓ Compliance: Should correctly categorize a VESTING_RELEASE transaction (135 ms)
      ✓ Defaults: Should default to PENDING status for new ledger entries (142 ms)
    Blockchain Traceability & Sync
      ✓ Integrity: Should store unique Pi Network TxID and memo (111 ms)
      ✓ Audit: Should verify that timestamps are enabled in the schema (148 ms)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:25:12.990Z - [INFO]: MapCap Audit Engine v1.5.5 Synchronized for Cloud Deployment.
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    
    ✅ TEST_ENGINE_READY: Connected to Remote Atlas

      at Object.<anonymous> (test/setup.js:43:15)

  console.log
    [ADMIN_ACTION] Manual Post-IPO Settlement sequence initiated at 2026-02-16T19:25:13.973Z

      at AdminController.triggerFinalSettlement (src/controllers/admin/admin.controller.js:31:21)

  console.log
    [ADMIN_ACTION] Manual Post-IPO Settlement sequence initiated at 2026-02-16T19:25:14.440Z

      at AdminController.triggerFinalSettlement (src/controllers/admin/admin.controller.js:31:21)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T19:25:14.444Z - [ERROR]: [ERR-MLPKDGZW-88A] Code: 400 | Message: Settlement Aborted: No liquidity detected in the IPO pool.
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at writeAuditLog (src/config/logger.js:66:17)
      at ResponseHelper.error (src/utils/response.helper.js:57:7)
      at AdminController.triggerFinalSettlement (src/controllers/admin/admin.controller.js:56:39)
      at Object.<anonymous> (test/unit/controllers/admin.controller.test.js:84:7)

  console.log
    [ADMIN_ACTION] Manual Post-IPO Settlement sequence initiated at 2026-02-16T19:25:14.515Z

      at AdminController.triggerFinalSettlement (src/controllers/admin/admin.controller.js:31:21)

  console.log
    🛑 TEST_ENGINE_OFFLINE: Resources deallocated.

      at Object.<anonymous> (test/setup.js:83:13)

PASS test/unit/controllers/admin.controller.test.js
  Admin Command Center - Unified Integrity Tests
    Settlement Engine - Logic & Safety
      ✓ Execution: Should successfully trigger the Whale-Trim-Back protocol and return status (467 ms)
      ✓ Safety: Should abort settlement and return 400 if total Pi pool is empty (75 ms)
      ✓ Audit: Should report execution metrics within the data object for the Dashboard (74 ms)
    Admin Gateway - Security & Route Verification
      ✓ Auth: POST /login must be reachable for administrator entry (67 ms)
      ✓ Security: High-stakes endpoints like /status and /settle must be protected (78 ms)
      ✓ Compliance: GET /audit-logs must be accessible for Daniel’s review (71 ms)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:25:16.400Z - [INFO]: MapCap Audit Engine v1.5.5 Synchronized for Cloud Deployment.
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    
    ✅ TEST_ENGINE_READY: Connected to Remote Atlas

      at Object.<anonymous> (test/setup.js:43:15)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:25:18.256Z - [INFO]: Investment Success: 100 Pi | Tx: TXID_2026_MAPCAP_SYNC | Pioneer: GBV...PIONEER_ADDR
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T19:25:18.393Z - [ERROR]: [ERR-MLPKDK1K-6PO] Code: 409 | Message: Duplicate Entry: This transaction has already been synchronized.
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at writeAuditLog (src/config/logger.js:66:17)
      at ResponseHelper.error (src/utils/response.helper.js:57:7)
      at PaymentController.processInvestment (src/controllers/payment.controller.js:45:39)
      at Object.<anonymous> (test/unit/controllers/payment.controller.test.js:98:7)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T19:25:18.535Z - [ERROR]: [ERR-MLPKDK5J-1I2] Code: 400 | Message: Missing Metadata: Transaction credentials (Address/Amount/TXID) are required.
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at writeAuditLog (src/config/logger.js:66:17)
      at ResponseHelper.error (src/utils/response.helper.js:57:7)
      at PaymentController.processInvestment (src/controllers/payment.controller.js:35:35)
      at Object.<anonymous> (test/unit/controllers/payment.controller.test.js:109:31)

  console.log
    🛑 TEST_ENGINE_OFFLINE: Resources deallocated.

      at Object.<anonymous> (test/setup.js:83:13)

PASS test/unit/controllers/payment.controller.test.js
  Payment & Pi Network Integration - Unit Tests
    Pi Network Infrastructure Constants
      ✓ API: Should verify Pi Network V2 and EscrowPi A2UaaS base endpoints (584 ms)
      ✓ Financials: Should enforce the mandatory 0.01 Pi network gas fee (143 ms)
      ✓ Security: Pi configuration object must be frozen to prevent tampering (132 ms)
    Investment Processing & Idempotency
      ✓ Success: Should process new investment and return 200 to the Frontend (138 ms)
      ✓ Security: Should block duplicate transactions (Idempotency Guard) (139 ms)
      ✓ Validation: Should reject requests with missing financial metadata (143 ms)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:25:20.321Z - [INFO]: MapCap Audit Engine v1.5.5 Synchronized for Cloud Deployment.
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    
    ✅ TEST_ENGINE_READY: Connected to Remote Atlas

      at Object.<anonymous> (test/setup.js:43:15)

  console.error
    [CRITICAL_CONTROLLER_ERROR]: DB_OFFLINE

      113 |              * Ensures system anomalies are captured for Daniel's audit review.
      114 |              */
    > 115 |             console.error(`[CRITICAL_CONTROLLER_ERROR]: ${error.message}`);
          |                     ^
      116 |             return ResponseHelper.error(res, "Dashboard Sync Failed: Financial Pipeline Offline", 500);
      117 |         }
      118 |     }

      at IpoController.getScreenStats (src/controllers/ipo.controller.js:115:21)
      at Object.<anonymous> (test/unit/controllers/ipo.controller.test.js:101:7)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T19:25:22.130Z - [ERROR]: [ERR-MLPKDMXE-DIS] Code: 500 | Message: Dashboard Sync Failed: Financial Pipeline Offline
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at writeAuditLog (src/config/logger.js:66:17)
      at ResponseHelper.error (src/utils/response.helper.js:57:7)
      at IpoController.getScreenStats (src/controllers/ipo.controller.js:116:35)
      at Object.<anonymous> (test/unit/controllers/ipo.controller.test.js:101:7)

  console.log
    🛑 TEST_ENGINE_OFFLINE: Resources deallocated.

      at Object.<anonymous> (test/setup.js:83:13)

PASS test/unit/controllers/ipo.controller.test.js
  IPO Controller & Branding - Dashboard Logic Tests
    Branding & Compliance Metadata
      ✓ Identity: Should verify correct Project naming and UI Theme colors (437 ms)
      ✓ Mechanics: Should align with Fixed Supply and Whale Cap specs (75 ms)
      ✓ Security: Branding configuration must be frozen to prevent runtime tampering (66 ms)
    Dashboard Logic & Whale-Shield Status
      ✓ Financials: Should deliver accurate formatted values (V1-V4) for UI (214 ms)
      ✓ Whale-Shield: Should return COMPLIANT status if share is within 10% cap (70 ms)
      ✓ Resilience: Should fail gracefully with 500 status on DB pipeline collapse (86 ms)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:25:24.496Z - [INFO]: MapCap Audit Engine v1.5.5 Synchronized for Cloud Deployment.
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    
    ✅ TEST_ENGINE_READY: Connected to Remote Atlas

      at Object.<anonymous> (test/setup.js:43:15)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T19:25:26.677Z - [ERROR]: [ERR-MLPKDQFP-EHR] Code: 400 | Message: Mandatory fields required: userWallet & amount.
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at writeAuditLog (src/config/logger.js:66:17)
      at ResponseHelper.error (src/utils/response.helper.js:57:7)
      at src/routes/api.js:72:31
      at Object.<anonymous> (test/unit/routes/api.routes.test.js:96:13)

  console.log
    🛑 TEST_ENGINE_OFFLINE: Resources deallocated.

      at Object.<anonymous> (test/setup.js:83:13)

PASS test/unit/routes/api.routes.test.js
  API & IPO Routing Architecture - Integrity Tests
    Global Stats & Health Endpoints
      ✓ Pulse: GET /stats should deliver synchronized scarcity engine metrics (544 ms)
      ✓ Health: GET /status should confirm "Daniel_Audit_Ready" operational state (136 ms)
    Financial Transaction Mapping
      ✓ Payment: POST /invest must map to PaymentController logic (138 ms)
      ✓ A2UaaS: POST /withdraw should securely trigger PayoutService sequence (154 ms)
      ✓ Security: POST /withdraw should intercept and reject missing wallet parameters (186 ms)

  console.log
    
    ✅ TEST_ENGINE_READY: Connected to Remote Atlas

      at Object.<anonymous> (test/setup.js:43:15)

  console.log
    🛑 TEST_ENGINE_OFFLINE: Resources deallocated.

      at Object.<anonymous> (test/setup.js:83:13)

PASS test/unit/scripts/cleanup.script.test.js
  System Maintenance Scripts - Operational Logic Tests
    DB Cleanup Script - Purge Protocol
      ✓ Cleanup: Should execute deleteMany with empty filter to wipe all records (595 ms)
      ✓ Safety: Should ensure environment context is evaluated for production protection (109 ms)
    Vesting Reset Script - Global Override
      ✓ Emergency: Should reset vesting progress and released balances globally (118 ms)
      ✓ Integrity: Reset operation must not tamper with identity or contribution fields (150 ms)

  console.log
    
    ✅ TEST_ENGINE_READY: Connected to Remote Atlas

      at Object.<anonymous> (test/setup.js:43:15)

  console.log
    🛑 TEST_ENGINE_OFFLINE: Resources deallocated.

      at Object.<anonymous> (test/setup.js:83:13)

PASS test/unit/models/admin.model.test.js
  Admin Model - Security & Role Integrity Tests
    ✓ Security: Should validate authorized roles and reject arbitrary access levels (502 ms)
    ✓ Privacy: Should confirm password exclusion from default data projection (69 ms)
    ✓ Safety: Should default to active and support administrative revocation (73 ms)
    ✓ Normalization: Should strictly lowercase usernames during model instantiation (75 ms)
    ✓ Integrity: Username field must have unique constraint enabled (76 ms)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:25:36.423Z - [INFO]: MapCap Audit Engine v1.5.5 Synchronized for Cloud Deployment.
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    
    ✅ TEST_ENGINE_READY: Connected to Remote Atlas

      at Object.<anonymous> (test/setup.js:43:15)

  console.log
    🛑 TEST_ENGINE_OFFLINE: Resources deallocated.

      at Object.<anonymous> (test/setup.js:83:13)

PASS test/unit/scripts/manual_trigger.test.js
  Manual Trigger - CLI Command Logic
    ✓ CLI Logic: Should accurately aggregate total pool from distributed records (468 ms)
    ✓ Action: WHALE_REFUND trigger should pass validated data to SettlementJob (113 ms)
    ✓ Safety: Should bypass settlement execution if total aggregated pool is zero (79 ms)

  console.log
    
    ✅ TEST_ENGINE_READY: Connected to Remote Atlas

      at Object.<anonymous> (test/setup.js:43:15)

  console.log
    🛑 TEST_ENGINE_OFFLINE: Resources deallocated.

      at Object.<anonymous> (test/setup.js:83:13)

PASS test/unit/services/price.service.test.js
  PriceService - Dynamic Scarcity Engine Tests
    ✓ Integrity: Should verify the IPO supply is locked at exactly 2,181,818 (382 ms)
    ✓ Calculation: Should accurately calculate spot price as liquidity increases (64 ms)
    ✓ Safety: Should return 0 for zero, null, or negative liquidity inputs (66 ms)
    ✓ Formatting: Should standardize price to 6 decimal places for audit logs (86 ms)
    ✓ UI/UX: Should format price to 4 decimal places for dashboard readability (62 ms)
    ✓ Sanitization: Should handle invalid numerical strings gracefully (74 ms)

  console.log
    
    ✅ TEST_ENGINE_READY: Connected to Remote Atlas

      at Object.<anonymous> (test/setup.js:43:15)

  console.log
    🛑 TEST_ENGINE_OFFLINE: Resources deallocated.

      at Object.<anonymous> (test/setup.js:83:13)

PASS test/unit/models/investor.model.test.js
  Investor Ecosystem - Unified Logic & Integrity Tests
    Core Schema Validation
      ✓ Validation: Should require a unique piAddress and block negative contributions (460 ms)
      ✓ Vesting: Should enforce the strict 10-month limit on completed tranches (66 ms)
      ✓ Audit: Should automatically track lastContributionDate on record creation (68 ms)
    Whale Identification & Boundary Logic
      ✓ Audit: Should accurately flag accounts exceeding the 10% ceiling (218,181.8) (69 ms)
      ✓ Boundary: Should not flag an account that is exactly at the 10% limit (66 ms)
    Virtual Properties & UI Protection
      ✓ Virtuals: sharePct must calculate correctly against the 2.18M supply (71 ms)
      ✓ Safety: remainingVesting must use Math.max to prevent negative asset display (71 ms)
    Provisioning & Seeding Logic
      ✓ Seeding: Should verify data purge and insertion of strategic profiles (71 ms)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:25:47.245Z - [INFO]: MapCap Audit Engine v1.5.5 Synchronized for Cloud Deployment.
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    
    ✅ TEST_ENGINE_READY: Connected to Remote Atlas

      at Object.<anonymous> (test/setup.js:43:15)

  console.log
    🛑 TEST_ENGINE_OFFLINE: Resources deallocated.

      at Object.<anonymous> (test/setup.js:83:13)

PASS test/unit/utils/api.response.test.js
  Global API Consistency - Response & Error Resilience
    ResponseHelper - Output Formatting
      ✓ Success: Should return a 200 status with standardized data and timestamp (25 ms)
      ✓ Error Handling: Should generate a unique Trace ID prefixed with ERR- (18 ms)
    Error Middleware - Global Resilience & Privacy
      ✓ Capture: Should normalize unhandled exceptions to a 500 JSON response (27 ms)
      ✓ Security: Should hide sensitive stack traces in production mode (15 ms)
      ✓ Propagation: Should maintain the existing HTTP status code (e.g., 403 Forbidden) (9 ms)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:25:50.020Z - [INFO]: MapCap Audit Engine v1.5.5 Synchronized for Cloud Deployment.
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    
    ✅ TEST_ENGINE_READY: Connected to Remote Atlas

      at Object.<anonymous> (test/setup.js:43:15)

  console.log
    [AUTH_SUCCESS] Administrative session granted for: admin

      at AuthController.adminLogin (src/controllers/admin/auth.controller.js:56:21)

  console.warn
    [SECURITY_ALERT] Unauthorized login attempt for: admin

      71 |          * Standardized logging for unauthorized access attempts.
      72 |          */
    > 73 |         console.warn(`[SECURITY_ALERT] Unauthorized login attempt for: ${username}`);
         |                 ^
      74 |         
      75 |         return ResponseHelper.error(res, "Authentication failed: Invalid credentials.", 401);
      76 |     }

      at AuthController.adminLogin (src/controllers/admin/auth.controller.js:73:17)
      at Object.<anonymous> (test/unit/controllers/admin.auth.test.js:75:26)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T19:25:51.258Z - [ERROR]: [ERR-MLPKE9EI-2XL] Code: 401 | Message: Authentication failed: Invalid credentials.
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at writeAuditLog (src/config/logger.js:66:17)
      at ResponseHelper.error (src/utils/response.helper.js:57:7)
      at AuthController.adminLogin (src/controllers/admin/auth.controller.js:75:31)
      at Object.<anonymous> (test/unit/controllers/admin.auth.test.js:75:26)

  console.log
    🛑 TEST_ENGINE_OFFLINE: Resources deallocated.

      at Object.<anonymous> (test/setup.js:83:13)

PASS test/unit/controllers/admin.auth.test.js
  Admin Auth Controller - Security & Integrity Tests
    ✓ Login Success: Should generate a secure JWT for authorized administrative access (43 ms)
    ✓ Security: Should enforce strict 401 Unauthorized status for invalid credentials (25 ms)
    ✓ Telemetry: Should provide accurate operational status for the Pulse Dashboard (10 ms)

  console.log
    
    ✅ TEST_ENGINE_READY: Connected to Remote Atlas

      at Object.<anonymous> (test/setup.js:43:15)

  console.log
    🛑 TEST_ENGINE_OFFLINE: Resources deallocated.

      at Object.<anonymous> (test/setup.js:83:13)

PASS test/unit/utils/math.test.js
  MapCap Math Engine - Unit Tests
    ✓ Alpha Gain: Should calculate exactly 20% increase (17 ms)
    ✓ Whale-Shield: Should accurately flag stakes exceeding 10% threshold (6 ms)
    ✓ Precision: Should round to 6 decimal places with zero artifacts (6 ms)
    ✓ Resilience: Should return 0 for non-numerical inputs (6 ms)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T19:25:55.800Z - [INFO]: MapCap Audit Engine v1.5.5 Synchronized for Cloud Deployment.
    [0m

      at writeAuditLog (src/config/logger.js:68:17)

  console.log
    
    ✅ TEST_ENGINE_READY: Connected to Remote Atlas

      at Object.<anonymous> (test/setup.js:43:15)

  console.log
    [SECURITY_LOG] Admin Privilege Elevated | Time: 2026-02-16T19:25:56.920Z | IP: 127.0.0.1

      at adminAuth (src/middlewares/auth.middleware.js:45:17)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T19:25:56.974Z - [ERROR]: [ERR-MLPKEDTA-2PC] Code: 400 | Message: Protocol Violation: Withdrawal must be within 0.01% to 100% range.
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at writeAuditLog (src/config/logger.js:66:17)
      at ResponseHelper.error (src/utils/response.helper.js:57:7)
      at validateWithdrawal (src/middlewares/validate.middleware.js:40:31)
      at Object.<anonymous> (test/unit/middlewares/auth.middleware.test.js:88:7)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T19:25:56.982Z - [ERROR]: [ERR-MLPKEDTI-MUH] Code: 400 | Message: Protocol Violation: Withdrawal must be within 0.01% to 100% range.
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at writeAuditLog (src/config/logger.js:66:17)
      at ResponseHelper.error (src/utils/response.helper.js:57:7)
      at validateWithdrawal (src/middlewares/validate.middleware.js:40:31)
      at Object.<anonymous> (test/unit/middlewares/auth.middleware.test.js:93:7)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T19:25:56.996Z - [ERROR]: [ERR-MLPKEDTW-N33] Code: 400 | Message: Compliance Error: 'percentage' and 'userWallet' are mandatory.
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at writeAuditLog (src/config/logger.js:66:17)
      at ResponseHelper.error (src/utils/response.helper.js:57:7)
      at validateWithdrawal (src/middlewares/validate.middleware.js:27:31)
      at Object.<anonymous> (test/unit/middlewares/auth.middleware.test.js:99:7)

  console.log
    🛑 TEST_ENGINE_OFFLINE: Resources deallocated.

      at Object.<anonymous> (test/setup.js:83:13)

PASS test/unit/middlewares/auth.middleware.test.js
  API Guard - Security & Validation Unit Tests
    Admin Auth Middleware - Access Control
      ✓ Access: Should grant entry (next()) when a valid x-admin-token is provided (30 ms)
      ✓ Protection: Should return 403 Forbidden for invalid or missing tokens (15 ms)
    Withdrawal Validation - Financial Guard
      ✓ Integrity: Should parse and allow valid withdrawal percentages (e.g., 50%) (10 ms)
      ✓ Safety: Should reject missing metadata or out-of-range percentages (>100% or <=0%) (22 ms)
      ✓ Compliance: Should return 400 if the mandatory userWallet is missing (13 ms)

  console.log
    
    ✅ TEST_ENGINE_READY: Connected to Remote Atlas

      at Object.<anonymous> (test/setup.js:43:15)

  console.log
    🛑 TEST_ENGINE_OFFLINE: Resources deallocated.

      at Object.<anonymous> (test/setup.js:83:13)

PASS test/unit/utils/project.integrity.test.js
  Project Integrity - Architecture & Security Policy
    Dependency & Metadata Guard
      ✓ Metadata: Should align with stabilized v1.7.x and ESM standards (14 ms)
      ✓ Runtime: Must enforce Node.js >=18.0.0 for Top-level Await support (5 ms)
      ✓ Stack: Should verify presence of Core Financial & Security libraries (10 ms)
      ✓ Scripts: Should define standardized Start/Dev entry points for Vercel/Termux (7 ms)
    Version Control Security Policy
      ✓ Security: Must strictly ignore .env files to prevent credential exposure (7 ms)
      ✓ Architecture: Should exclude node_modules and bulky log files (6 ms)
      ✓ Cleanliness: Should ignore IDE-specific metadata (.vscode, .DS_Store) (6 ms)

Summary of all failing tests
FAIL test/integration/payout.pipeline.test.js (9.886 s)
  ● Payout Pipeline - End-to-End Financial Integration › Vesting Flow: Successful Pi transfer should update the investor ledger

    expect(jest.fn()).toHaveBeenCalled()

    Expected number of calls: >= 1
    Received number of calls:    0

      102 |     // Assertions: Validate HTTP status (200 OK or 201 Created)
      103 |     expect(response.status).toBeLessThan(400); 
    > 104 |     expect(paymentSpy).toHaveBeenCalled();
          |                        ^
      105 |     // Ensuring the ledger reflects the progression
      106 |     expect(updatedPioneer.vestingMonthsCompleted).toBe(1);
      107 |   });

      at Object.<anonymous> (test/integration/payout.pipeline.test.js:104:24)

FAIL test/unit/utils/system.health.test.js (5.548 s)
  ● System Health & Cloud Infrastructure - Unit Tests › Server Engine - Heartbeat Integration › Heartbeat: GET / should return 200 and live financial metrics for UI

    TypeError: Cannot read properties of undefined (reading 'total_pi_invested')

      52 |       expect(res.statusCode).toEqual(200);
      53 |       expect(res.body.success).toBe(true);
    > 54 |       expect(res.body.data.live_metrics.total_pi_invested).toBe(1000000);
         |                                         ^
      55 |       
      56 |       aggregateSpy.mockRestore();
      57 |     });

      at Object.<anonymous> (test/unit/utils/system.health.test.js:54:41)


Test Suites: 2 failed, 21 passed, 23 total
Tests:       2 failed, 114 passed, 116 total
Snapshots:   0 total
Time:        101.309 s
Ran all test suites.
