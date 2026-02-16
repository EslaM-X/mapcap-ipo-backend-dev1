
> mapcap-ipo-backend@1.6.5 test
> cross-env NODE_ENV=test NODE_OPTIONS='--experimental-vm-modules' jest --runInBand

  console.log
    [32m[AUDIT_INFO] 2026-02-16T06:59:58.358Z - [INFO]: MapCap Audit Engine v1.5.5 Synchronized for Cloud Deployment.
    [0m

      at log (src/config/logger.js:68:17)

(node:19722) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
  console.log
    
    🚀 Test Engine Connected: Remote Cloud (Termux-Ready)

      at Object.log (test/setup.js:47:15)

  console.log
    --- [MARKET_ENGINE] Starting Daily Price Recalibration Cycle ---

      at DailyPriceJob.log [as updatePrice] (src/jobs/daily-price-update.js:26:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:00:00.697Z - [INFO]: [MARKET_SNAPSHOT] Pool: 100000 Pi | Spot Price: 21.818180
    [0m

      at log (src/config/logger.js:68:17)

  console.log
    [AUDIT] Current Water-Level: 100000 Pi

      at DailyPriceJob.log [as updatePrice] (src/jobs/daily-price-update.js:54:21)

  console.log
    [AUDIT] Market Spot Price: 21.818180

      at DailyPriceJob.log [as updatePrice] (src/jobs/daily-price-update.js:55:21)

  console.log
    --- [SUCCESS] Market Recalibration Cycle Finalized ---

      at DailyPriceJob.log [as updatePrice] (src/jobs/daily-price-update.js:62:21)

  console.log
    --- [MARKET_ENGINE] Starting Daily Price Recalibration Cycle ---

      at DailyPriceJob.log [as updatePrice] (src/jobs/daily-price-update.js:26:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:00:01.759Z - [INFO]: [MARKET_SNAPSHOT] Pool: 0 Pi | Spot Price: 0.000000
    [0m

      at log (src/config/logger.js:68:17)

  console.log
    [AUDIT] Current Water-Level: 0 Pi

      at DailyPriceJob.log [as updatePrice] (src/jobs/daily-price-update.js:54:21)

  console.log
    [AUDIT] Market Spot Price: 0.000000

      at DailyPriceJob.log [as updatePrice] (src/jobs/daily-price-update.js:55:21)

  console.log
    --- [SUCCESS] Market Recalibration Cycle Finalized ---

      at DailyPriceJob.log [as updatePrice] (src/jobs/daily-price-update.js:62:21)

  console.log
    --- [MARKET_ENGINE] Starting Daily Price Recalibration Cycle ---

      at DailyPriceJob.log [as updatePrice] (src/jobs/daily-price-update.js:26:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:00:02.018Z - [INFO]: [MARKET_SNAPSHOT] Pool: 100000 Pi | Spot Price: 21.818180
    [0m

      at log (src/config/logger.js:68:17)

  console.log
    [AUDIT] Current Water-Level: 100000 Pi

      at DailyPriceJob.log [as updatePrice] (src/jobs/daily-price-update.js:54:21)

  console.log
    [AUDIT] Market Spot Price: 21.818180

      at DailyPriceJob.log [as updatePrice] (src/jobs/daily-price-update.js:55:21)

  console.log
    --- [SUCCESS] Market Recalibration Cycle Finalized ---

      at DailyPriceJob.log [as updatePrice] (src/jobs/daily-price-update.js:62:21)

  console.log
    --- [SYSTEM] Cron Scheduler Engine Initialized (UTC Mode) ---

      at CronScheduler.log [as init] (src/jobs/cron.scheduler.js:27:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:00:02.250Z - [INFO]: Cron Scheduler Engine Online.
    [0m

      at log (src/config/logger.js:68:17)

  console.log
    --- [SYSTEM] Cron Scheduler Engine Initialized (UTC Mode) ---

      at CronScheduler.log [as init] (src/jobs/cron.scheduler.js:27:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:00:02.490Z - [INFO]: Cron Scheduler Engine Online.
    [0m

      at log (src/config/logger.js:68:17)

  console.log
    --- [SYSTEM] Cron Scheduler Engine Initialized (UTC Mode) ---

      at CronScheduler.log [as init] (src/jobs/cron.scheduler.js:27:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:00:02.717Z - [INFO]: Cron Scheduler Engine Online.
    [0m

      at log (src/config/logger.js:68:17)

  console.log
    --- [SYSTEM] Cron Scheduler Engine Initialized (UTC Mode) ---

      at CronScheduler.log [as init] (src/jobs/cron.scheduler.js:27:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:00:03.047Z - [INFO]: Cron Scheduler Engine Online.
    [0m

      at log (src/config/logger.js:68:17)

  console.log
    🛑 Test Engine Shutdown: Database connection terminated cleanly.

      at Object.log (test/setup.js:88:13)

PASS test/unit/jobs/daily_price.job.test.js (8.938 s)
  Daily Automation & Market Logic - Unit Tests
    Daily Price Job - Financial Precision
      ✓ Recalibration: Should calculate correct spot price with 6-decimal precision (1027 ms)
      ✓ Safety: Should return a 0.000000 price when total liquidity is zero (275 ms)
      ✓ Audit: Should include a valid ISO timestamp for the price snapshot (222 ms)
    Cron Scheduler - Task Orchestration
      ✓ Orchestration: Should initialize exactly 3 core automated tasks on boot (246 ms)
      ✓ Scheduling: Daily Price Job must be set for Midnight UTC (232 ms)
      ✓ Scheduling: Monthly Vesting must be set for the 1st of each month (317 ms)
      ✓ Scheduling: Final Whale Settlement must trigger on the 28th day (258 ms)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:00:06.818Z - [INFO]: MapCap Audit Engine v1.5.5 Synchronized for Cloud Deployment.
    [0m

      at log (src/config/logger.js:68:17)

  console.log
    
    🚀 Test Engine Connected: Remote Cloud (Termux-Ready)

      at Object.log (test/setup.js:47:15)

  console.warn
    [SECURITY_ALERT] Blocked unauthorized Admin attempt from IP: ::ffff:127.0.0.1

      42 |      * We return a standardized JSON error to ensure Frontend stability.
      43 |      */
    > 44 |     console.warn(`[SECURITY_ALERT] Blocked unauthorized Admin attempt from IP: ${req.ip}`);
         |             ^
      45 |
      46 |     return res.status(403).json({ 
      47 |         success: false, 

      at warn (src/middlewares/auth.middleware.js:44:13)
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

  console.warn
    [SECURITY_ALERT] Blocked unauthorized Admin attempt from IP: ::ffff:127.0.0.1

      42 |      * We return a standardized JSON error to ensure Frontend stability.
      43 |      */
    > 44 |     console.warn(`[SECURITY_ALERT] Blocked unauthorized Admin attempt from IP: ${req.ip}`);
         |             ^
      45 |
      46 |     return res.status(403).json({ 
      47 |         success: false, 

      at warn (src/middlewares/auth.middleware.js:44:13)
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
      at jsonParser (node_modules/body-parser/lib/types/json.js:122:7)
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

  console.warn
    [SECURITY_ALERT] Blocked unauthorized Admin attempt from IP: ::ffff:127.0.0.1

      42 |      * We return a standardized JSON error to ensure Frontend stability.
      43 |      */
    > 44 |     console.warn(`[SECURITY_ALERT] Blocked unauthorized Admin attempt from IP: ${req.ip}`);
         |             ^
      45 |
      46 |     return res.status(403).json({ 
      47 |         success: false, 

      at warn (src/middlewares/auth.middleware.js:44:13)
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

FAIL test/integration/admin.ops.test.js (7.423 s)
  Admin Operations - Security & Settlement Integration
    ✓ Security: GET /api/v1/admin/audit-logs should reject unauthenticated requests (1139 ms)
    ✕ Settlement: POST /api/v1/admin/settle should execute with a valid admin token (633 ms)
    ✕ Audit: GET /api/v1/admin/status should return system metrics for Daniel’s review (400 ms)

  ● Admin Operations - Security & Settlement Integration › Settlement: POST /api/v1/admin/settle should execute with a valid admin token

    expect(received).toBe(expected) // Object.is equality

    Expected: 200
    Received: 403

      85 |       .set('Authorization', `Bearer ${adminToken}`);
      86 |
    > 87 |     expect(response.status).toBe(200);
         |                             ^
      88 |     expect(response.body.success).toBe(true);
      89 |     // Flexible matching for standardized success messages in v1.6.x
      90 |     expect(response.body.message).toMatch(/finalized|successfully|executed|settlement/i);

      at Object.toBe (test/integration/admin.ops.test.js:87:29)

  ● Admin Operations - Security & Settlement Integration › Audit: GET /api/v1/admin/status should return system metrics for Daniel’s review

    expect(received).toBe(expected) // Object.is equality

    Expected: 200
    Received: 403

      100 |       .set('Authorization', `Bearer ${adminToken}`);
      101 |
    > 102 |     expect(response.status).toBe(200);
          |                             ^
      103 |     expect(response.body.success).toBe(true);
      104 |     
      105 |     // Check for standardized data encapsulation for Dashboard compatibility

      at Object.toBe (test/integration/admin.ops.test.js:102:29)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:00:13.058Z - [INFO]: MapCap Audit Engine v1.5.5 Synchronized for Cloud Deployment.
    [0m

      at log (src/config/logger.js:68:17)

  console.log
    
    🚀 Test Engine Connected: Remote Cloud (Termux-Ready)

      at Object.log (test/setup.js:47:15)

FAIL test/integration/payout.pipeline.test.js (6.505 s)
  Payout Pipeline - End-to-End Financial Integration
    ✕ Vesting Flow: Successful Pi transfer should update the investor ledger (1515 ms)
    ✓ Resilience: Database should not update if the Payout Service fails (794 ms)

  ● Payout Pipeline - End-to-End Financial Integration › Vesting Flow: Successful Pi transfer should update the investor ledger

    expect(received).toBe(expected) // Object.is equality

    Expected: 200
    Received: 404

      80 |     const updatedPioneer = await Investor.findById(pioneer._id);
      81 |     
    > 82 |     expect(response.status).toBe(200);
         |                             ^
      83 |     expect(paymentSpy).toHaveBeenCalled();
      84 |     expect(updatedPioneer.vestingMonthsCompleted).toBe(1);
      85 |     expect(updatedPioneer.lastPayoutTxId).toBe('PI_BLOCK_999');

      at Object.toBe (test/integration/payout.pipeline.test.js:82:29)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:00:19.112Z - [INFO]: MapCap Audit Engine v1.5.5 Synchronized for Cloud Deployment.
    [0m

      at log (src/config/logger.js:68:17)

  console.log
    
    🚀 Test Engine Connected: Remote Cloud (Termux-Ready)

      at Object.log (test/setup.js:47:15)

  console.log
    --- [COMPLIANCE] Initiating Post-IPO Final Settlement Sequence ---

      at SettlementJob.log [as executeWhaleTrimBack] (src/jobs/settlement.job.js:29:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:00:20.849Z - [INFO]: Whale Settlement Triggered. Final Water-Level: 100000 Pi
    [0m

      at log (src/config/logger.js:68:17)

  console.warn
    [WHALE_CAP_TRIGGERED] Wallet: Whale_001 | Surplus: 5000.555555 Pi

      50 |                 if (preciseRefund <= 0) continue;
      51 |
    > 52 |                 console.warn(`[WHALE_CAP_TRIGGERED] Wallet: ${investor.piAddress} | Surplus: ${preciseRefund} Pi`);
         |                         ^
      53 |
      54 |                 try {
      55 |                     /**

      at SettlementJob.warn [as executeWhaleTrimBack] (src/jobs/settlement.job.js:52:25)
      at Object.<anonymous> (test/unit/jobs/settlement.job.test.js:55:22)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:00:20.859Z - [INFO]: Settlement Success: 5000.555555 Pi returned to Whale_001. Threshold maintained.
    [0m

      at log (src/config/logger.js:68:17)

  console.log
    --- [SUMMARY] Settlement Finalized. Total Refunded: 5000.555555 | Accounts Capped: 1 ---

      at SettlementJob.log [as executeWhaleTrimBack] (src/jobs/settlement.job.js:77:21)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:00:20.864Z - [INFO]: Settlement Finalized. Total Refunded: 5000.555555 | Accounts Capped: 1
    [0m

      at log (src/config/logger.js:68:17)

  console.log
    --- [COMPLIANCE] Initiating Post-IPO Final Settlement Sequence ---

      at SettlementJob.log [as executeWhaleTrimBack] (src/jobs/settlement.job.js:29:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:00:21.709Z - [INFO]: Whale Settlement Triggered. Final Water-Level: 100000 Pi
    [0m

      at log (src/config/logger.js:68:17)

  console.warn
    [WHALE_CAP_TRIGGERED] Wallet: Whale_A | Surplus: 2000 Pi

      50 |                 if (preciseRefund <= 0) continue;
      51 |
    > 52 |                 console.warn(`[WHALE_CAP_TRIGGERED] Wallet: ${investor.piAddress} | Surplus: ${preciseRefund} Pi`);
         |                         ^
      53 |
      54 |                 try {
      55 |                     /**

      at SettlementJob.warn [as executeWhaleTrimBack] (src/jobs/settlement.job.js:52:25)
      at Object.<anonymous> (test/unit/jobs/settlement.job.test.js:80:22)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:00:21.723Z - [INFO]: Settlement Success: 2000 Pi returned to Whale_A. Threshold maintained.
    [0m

      at log (src/config/logger.js:68:17)

  console.warn
    [WHALE_CAP_TRIGGERED] Wallet: Whale_B | Surplus: 3000 Pi

      50 |                 if (preciseRefund <= 0) continue;
      51 |
    > 52 |                 console.warn(`[WHALE_CAP_TRIGGERED] Wallet: ${investor.piAddress} | Surplus: ${preciseRefund} Pi`);
         |                         ^
      53 |
      54 |                 try {
      55 |                     /**

      at SettlementJob.warn [as executeWhaleTrimBack] (src/jobs/settlement.job.js:52:25)
      at Object.<anonymous> (test/unit/jobs/settlement.job.test.js:80:22)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:00:21.732Z - [INFO]: Settlement Success: 3000 Pi returned to Whale_B. Threshold maintained.
    [0m

      at log (src/config/logger.js:68:17)

  console.log
    --- [SUMMARY] Settlement Finalized. Total Refunded: 5000 | Accounts Capped: 2 ---

      at SettlementJob.log [as executeWhaleTrimBack] (src/jobs/settlement.job.js:77:21)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:00:21.738Z - [INFO]: Settlement Finalized. Total Refunded: 5000 | Accounts Capped: 2
    [0m

      at log (src/config/logger.js:68:17)

  console.log
    🕒 --- [VESTING_ENGINE] Monthly Distribution Cycle Started ---

      at VestingJob.log [as executeMonthlyVesting] (src/jobs/vesting.job.js:27:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:00:21.930Z - [INFO]: Vesting Engine: Monthly Tranche Release Initiated.
    [0m

      at log (src/config/logger.js:68:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:00:21.936Z - [INFO]: [TRANCHE_RELEASED] 1/10 to Pioneer_001
    [0m

      at log (src/config/logger.js:68:17)

  console.log
    🏁 --- [SUCCESS] Monthly Vesting Cycle Finalized ---

      at VestingJob.log [as executeMonthlyVesting] (src/jobs/vesting.job.js:77:21)

  console.log
    🕒 --- [VESTING_ENGINE] Monthly Distribution Cycle Started ---

      at VestingJob.log [as executeMonthlyVesting] (src/jobs/vesting.job.js:27:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:00:22.151Z - [INFO]: Vesting Engine: Monthly Tranche Release Initiated.
    [0m

      at log (src/config/logger.js:68:17)

  console.log
    ℹ️ [SYSTEM] Idle State: No pending vesting tranches detected.

      at VestingJob.log [as executeMonthlyVesting] (src/jobs/vesting.job.js:43:25)

  console.log
    --- [COMPLIANCE] Initiating Post-IPO Final Settlement Sequence ---

      at SettlementJob.log [as executeWhaleTrimBack] (src/jobs/settlement.job.js:29:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:00:22.324Z - [INFO]: Whale Settlement Triggered. Final Water-Level: 100000 Pi
    [0m

      at log (src/config/logger.js:68:17)

  console.warn
    [WHALE_CAP_TRIGGERED] Wallet: Whale_Fail | Surplus: 10000 Pi

      50 |                 if (preciseRefund <= 0) continue;
      51 |
    > 52 |                 console.warn(`[WHALE_CAP_TRIGGERED] Wallet: ${investor.piAddress} | Surplus: ${preciseRefund} Pi`);
         |                         ^
      53 |
      54 |                 try {
      55 |                     /**

      at SettlementJob.warn [as executeWhaleTrimBack] (src/jobs/settlement.job.js:52:25)
      at Object.<anonymous> (test/unit/jobs/settlement.job.test.js:142:7)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T07:00:22.336Z - [CRITICAL]: PAYOUT_FAILED for Whale_Fail: A2U Timeout
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at error (src/config/logger.js:66:17)
      at SettlementJob.writeAuditLog [as executeWhaleTrimBack] (src/jobs/settlement.job.js:72:21)
      at Object.<anonymous> (test/unit/jobs/settlement.job.test.js:142:7)

  console.error
    [CRITICAL_FAILURE] Settlement execution error for Whale_Fail

      71 |                 } catch (payoutError) {
      72 |                     writeAuditLog('CRITICAL', `PAYOUT_FAILED for ${investor.piAddress}: ${payoutError.message}`);
    > 73 |                     console.error(`[CRITICAL_FAILURE] Settlement execution error for ${investor.piAddress}`);
         |                             ^
      74 |                 }
      75 |             }
      76 |

      at SettlementJob.error [as executeWhaleTrimBack] (src/jobs/settlement.job.js:73:29)
      at Object.<anonymous> (test/unit/jobs/settlement.job.test.js:142:7)

  console.warn
    [WHALE_CAP_TRIGGERED] Wallet: Whale_Success | Surplus: 10000 Pi

      50 |                 if (preciseRefund <= 0) continue;
      51 |
    > 52 |                 console.warn(`[WHALE_CAP_TRIGGERED] Wallet: ${investor.piAddress} | Surplus: ${preciseRefund} Pi`);
         |                         ^
      53 |
      54 |                 try {
      55 |                     /**

      at SettlementJob.warn [as executeWhaleTrimBack] (src/jobs/settlement.job.js:52:25)
      at Object.<anonymous> (test/unit/jobs/settlement.job.test.js:142:7)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:00:22.345Z - [INFO]: Settlement Success: 10000 Pi returned to Whale_Success. Threshold maintained.
    [0m

      at log (src/config/logger.js:68:17)

  console.log
    --- [SUMMARY] Settlement Finalized. Total Refunded: 10000 | Accounts Capped: 1 ---

      at SettlementJob.log [as executeWhaleTrimBack] (src/jobs/settlement.job.js:77:21)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:00:22.349Z - [INFO]: Settlement Finalized. Total Refunded: 10000 | Accounts Capped: 1
    [0m

      at log (src/config/logger.js:68:17)

  console.log
    🕒 --- [VESTING_ENGINE] Monthly Distribution Cycle Started ---

      at VestingJob.log [as executeMonthlyVesting] (src/jobs/vesting.job.js:27:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:00:22.516Z - [INFO]: Vesting Engine: Monthly Tranche Release Initiated.
    [0m

      at log (src/config/logger.js:68:17)

  console.log
    🏁 --- [SUCCESS] Monthly Vesting Cycle Finalized ---

      at VestingJob.log [as executeMonthlyVesting] (src/jobs/vesting.job.js:77:21)

  console.log
    🛑 Test Engine Shutdown: Database connection terminated cleanly.

      at Object.log (test/setup.js:88:13)

FAIL test/unit/jobs/settlement.job.test.js (5.394 s)
  Financial Lifecycle - Settlement & Vesting Unified Tests
    Whale Trim-Back - Precision & Enforcement
      ✓ Precision: Should refund excess Pi with 6-decimal floor truncation (868 ms)
      ✓ Aggregation: Should track total refunded Pi across all identified whales (217 ms)
    Monthly Vesting - Release Logic
      ✕ Calculation: Should release exactly 10% of equity per month (201 ms)
      ✓ Security: Should strictly filter out whales from the vesting queue (165 ms)
    System Fault Tolerance
      ✓ Resilience: Should continue processing queue if a single payout fails (194 ms)
      ✓ Integrity: Should not record progress if vesting payment fails (203 ms)

  ● Financial Lifecycle - Settlement & Vesting Unified Tests › Monthly Vesting - Release Logic › Calculation: Should release exactly 10% of equity per month

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: "Pioneer_001", 100, Any<String>
    Received: "Pioneer_001", 100

    Number of calls: 1

      105 |
      106 |       // Ensure PaymentService is called with correct distribution amount (1000 * 0.1)
    > 107 |       expect(PaymentService.transferPi).toHaveBeenCalledWith(
          |                                         ^
      108 |         'Pioneer_001', 
      109 |         100, 
      110 |         expect.any(String) 

      at Object.toHaveBeenCalledWith (test/unit/jobs/settlement.job.test.js:107:41)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:00:25.116Z - [INFO]: MapCap Audit Engine v1.5.5 Synchronized for Cloud Deployment.
    [0m

      at log (src/config/logger.js:68:17)

  console.log
    
    🚀 Test Engine Connected: Remote Cloud (Termux-Ready)

      at Object.log (test/setup.js:47:15)

FAIL test/integration/metrics.sync.test.js (5.542 s)
  Metrics Synchronization - System Pulse Integration
    ✕ Sync: Should fetch external Pi price and update GlobalConfig pulse (876 ms)
    ✕ Resilience: Should retain last known price if external sync fails (619 ms)

  ● Metrics Synchronization - System Pulse Integration › Sync: Should fetch external Pi price and update GlobalConfig pulse

    Property `fetchLatestPiPrice` does not exist in the provided object

      58 |     };
      59 |
    > 60 |     const priceSpy = jest.spyOn(PriceService, 'fetchLatestPiPrice')
         |                           ^
      61 |       .mockResolvedValue(mockPriceData);
      62 |
      63 |     // 2. Trigger the sync via the Admin/Cron endpoint

      at ModuleMocker.spyOn (node_modules/jest-mock/build/index.js:731:13)
      at Object.spyOn (test/integration/metrics.sync.test.js:60:27)

  ● Metrics Synchronization - System Pulse Integration › Resilience: Should retain last known price if external sync fails

    Property `fetchLatestPiPrice` does not exist in the provided object

      88 |
      89 |     // 2. Simulate external API failure (Timeout or Oracle Connectivity Error)
    > 90 |     jest.spyOn(PriceService, 'fetchLatestPiPrice')
         |          ^
      91 |       .mockRejectedValue(new Error('Oracle Offline'));
      92 |
      93 |     const response = await request(app)

      at ModuleMocker.spyOn (node_modules/jest-mock/build/index.js:731:13)
      at Object.spyOn (test/integration/metrics.sync.test.js:90:10)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:00:30.639Z - [INFO]: MapCap Audit Engine v1.5.5 Synchronized for Cloud Deployment.
    [0m

      at log (src/config/logger.js:68:17)

  console.log
    
    🚀 Test Engine Connected: Remote Cloud (Termux-Ready)

      at Object.log (test/setup.js:47:15)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T07:00:32.535Z - [ERROR]: [ERR-MLOTRS7R-KO0] Code: 400 | Message: Missing transaction metadata: 'piAddress', 'amount', and 'piTxId' are required.
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at error (src/config/logger.js:66:17)
      at ResponseHelper.writeAuditLog [as error] (src/utils/response.helper.js:57:7)
      at error (src/controllers/payment.controller.js:32:35)
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
      at node_modules/body-parser/lib/read.js:137:5
      at invokeCallback (node_modules/raw-body/index.js:238:16)
      at done (node_modules/raw-body/index.js:227:7)
      at IncomingMessage.onEnd (node_modules/raw-body/index.js:287:7)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T07:00:33.590Z - [ERROR]: [ERR-MLOTRT12-SBR] Code: 400 | Message: Missing transaction metadata: 'piAddress', 'amount', and 'piTxId' are required.
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at error (src/config/logger.js:66:17)
      at ResponseHelper.writeAuditLog [as error] (src/utils/response.helper.js:57:7)
      at error (src/controllers/payment.controller.js:32:35)
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
      at node_modules/body-parser/lib/read.js:137:5
      at invokeCallback (node_modules/raw-body/index.js:238:16)
      at done (node_modules/raw-body/index.js:227:7)
      at IncomingMessage.onEnd (node_modules/raw-body/index.js:287:7)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T07:00:33.628Z - [ERROR]: [ERR-MLOTRT24-K36] Code: 400 | Message: Missing transaction metadata: 'piAddress', 'amount', and 'piTxId' are required.
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at error (src/config/logger.js:66:17)
      at ResponseHelper.writeAuditLog [as error] (src/utils/response.helper.js:57:7)
      at error (src/controllers/payment.controller.js:32:35)
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
      at node_modules/body-parser/lib/read.js:137:5
      at invokeCallback (node_modules/raw-body/index.js:238:16)
      at done (node_modules/raw-body/index.js:227:7)
      at IncomingMessage.onEnd (node_modules/raw-body/index.js:287:7)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T07:00:34.043Z - [ERROR]: [ERR-MLOTRTDN-TIB] Code: 400 | Message: Missing transaction metadata: 'piAddress', 'amount', and 'piTxId' are required.
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at error (src/config/logger.js:66:17)
      at ResponseHelper.writeAuditLog [as error] (src/utils/response.helper.js:57:7)
      at error (src/controllers/payment.controller.js:32:35)
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
      at node_modules/body-parser/lib/read.js:137:5
      at invokeCallback (node_modules/raw-body/index.js:238:16)
      at done (node_modules/raw-body/index.js:227:7)
      at IncomingMessage.onEnd (node_modules/raw-body/index.js:287:7)

FAIL test/integration/ipo.contribution.test.js (6.073 s)
  IPO Contribution Pipeline - Integration Tests
    ✕ Success: POST /api/v1/ipo/invest should persist data and return 201 Created (1095 ms)
    ✕ Security: Should reject duplicate txId to prevent double-entry (455 ms)
    ✓ Guard: Should reject requests with negative or zero amounts (439 ms)

  ● IPO Contribution Pipeline - Integration Tests › Success: POST /api/v1/ipo/invest should persist data and return 201 Created

    expect(received).toBe(expected) // Object.is equality

    Expected: 201
    Received: 400

      62 |       .send(contributionPayload);
      63 |
    > 64 |     expect(response.status).toBe(201);
         |                             ^
      65 |     expect(response.body.success).toBe(true);
      66 |     
      67 |     // Integrity Check: Verifying data persistence in the ledger

      at Object.toBe (test/integration/ipo.contribution.test.js:64:29)

  ● IPO Contribution Pipeline - Integration Tests › Security: Should reject duplicate txId to prevent double-entry

    expect(received).toMatch(expected)

    Expected pattern: /duplicate|already exists/i
    Received string:  "Missing transaction metadata: 'piAddress', 'amount', and 'piTxId' are required."

      89 |
      90 |     expect(response.status).toBe(400);
    > 91 |     expect(response.body.message).toMatch(/duplicate|already exists/i);
         |                                   ^
      92 |   });
      93 |
      94 |   /**

      at Object.toMatch (test/integration/ipo.contribution.test.js:91:35)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:00:36.731Z - [INFO]: MapCap Audit Engine v1.5.5 Synchronized for Cloud Deployment.
    [0m

      at log (src/config/logger.js:68:17)

  console.log
    🛑 Test Engine Shutdown: Database connection terminated cleanly.

      at Object.log (test/setup.js:88:13)

PASS test/unit/utils/system.health.test.js (6.399 s)
  System Health & Cloud Infrastructure - Unit Tests
    Server Engine - Heartbeat Integration
      ✓ Heartbeat: GET / should return 200 and live financial metrics for UI (984 ms)
      ✓ Security: Should verify CORS headers for cross-origin dashboard access (432 ms)
    Audit Logger - Transparency & Alerts
      ✓ INFO Logs: Should format operational entries with [AUDIT_INFO] tag (262 ms)
      ✓ CRITICAL Alerts: Should elevate priority for security/pipeline failures (206 ms)
    Vercel Config - Serverless Security
      ✓ Security: Should enforce no-store headers to prevent stale financial data (226 ms)
      ✓ Environment: Should enable experimental-modules for Node runtime support (252 ms)

  console.log
    
    🚀 Test Engine Connected: Remote Cloud (Termux-Ready)

      at Object.log (test/setup.js:47:15)

  console.log
    🛑 Test Engine Shutdown: Database connection terminated cleanly.

      at Object.log (test/setup.js:88:13)

PASS test/unit/scripts/cleanup.script.test.js
  System Maintenance Scripts - Operational Logic Tests
    DB Cleanup Script - Purge Protocol
      ✓ Cleanup: Should execute deleteMany with empty filter to wipe all records (617 ms)
      ✓ Safety: Should ensure environment context is evaluated for production protection (70 ms)
    Vesting Reset Script - Global Override
      ✓ Emergency: Should reset vesting progress and released balances globally (80 ms)
      ✓ Integrity: Reset operation must not tamper with identity or contribution fields (85 ms)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:00:46.739Z - [INFO]: MapCap Audit Engine v1.5.5 Synchronized for Cloud Deployment.
    [0m

      at log (src/config/logger.js:68:17)

  console.log
    
    🚀 Test Engine Connected: Remote Cloud (Termux-Ready)

      at Object.log (test/setup.js:47:15)

  console.error
    [CRITICAL_CONTROLLER_ERROR]: DB_OFFLINE

      113 |              * Ensures system anomalies are captured for Daniel's audit review.
      114 |              */
    > 115 |             console.error(`[CRITICAL_CONTROLLER_ERROR]: ${error.message}`);
          |                     ^
      116 |             return ResponseHelper.error(res, "Dashboard Sync Failed: Financial Pipeline Offline", 500);
      117 |         }
      118 |     }

      at IpoController.error [as getScreenStats] (src/controllers/ipo.controller.js:115:21)
      at Object.<anonymous> (test/unit/controllers/ipo.controller.test.js:101:7)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T07:00:49.801Z - [ERROR]: [ERR-MLOTS5JD-CFI] Code: 500 | Message: Dashboard Sync Failed: Financial Pipeline Offline
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at error (src/config/logger.js:66:17)
      at ResponseHelper.writeAuditLog [as error] (src/utils/response.helper.js:57:7)
      at IpoController.error [as getScreenStats] (src/controllers/ipo.controller.js:116:35)
      at Object.<anonymous> (test/unit/controllers/ipo.controller.test.js:101:7)

  console.log
    🛑 Test Engine Shutdown: Database connection terminated cleanly.

      at Object.log (test/setup.js:88:13)

PASS test/unit/controllers/ipo.controller.test.js
  IPO Controller & Branding - Dashboard Logic Tests
    Branding & Compliance Metadata
      ✓ Identity: Should verify correct Project naming and UI Theme colors (713 ms)
      ✓ Mechanics: Should align with Fixed Supply and Whale Cap specs (143 ms)
      ✓ Security: Branding configuration must be frozen to prevent runtime tampering (116 ms)
    Dashboard Logic & Whale-Shield Status
      ✓ Financials: Should deliver accurate formatted values (V1-V4) for UI (271 ms)
      ✓ Whale-Shield: Should return COMPLIANT status if share is within 10% cap (108 ms)
      ✓ Resilience: Should fail gracefully with 500 status on DB pipeline collapse (159 ms)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:00:51.558Z - [INFO]: MapCap Audit Engine v1.5.5 Synchronized for Cloud Deployment.
    [0m

      at log (src/config/logger.js:68:17)

  console.log
    
    🚀 Test Engine Connected: Remote Cloud (Termux-Ready)

      at Object.log (test/setup.js:47:15)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:00:54.587Z - [INFO]: Investment Processed: 100 Pi from GBV...PIONEER_ADDR (TX: TXID_2026_MAPCAP_SYNC)
    [0m

      at log (src/config/logger.js:68:17)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T07:00:54.877Z - [ERROR]: [ERR-MLOTS9GD-02I] Code: 409 | Message: Duplicate Transaction: TXID already processed in the ledger.
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at error (src/config/logger.js:66:17)
      at ResponseHelper.writeAuditLog [as error] (src/utils/response.helper.js:57:7)
      at PaymentController.error [as processInvestment] (src/controllers/payment.controller.js:42:39)
      at Object.<anonymous> (test/unit/controllers/payment.controller.test.js:103:7)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T07:00:55.130Z - [ERROR]: [ERR-MLOTS9NE-USP] Code: 400 | Message: Missing transaction metadata: 'piAddress', 'amount', and 'piTxId' are required.
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at error (src/config/logger.js:66:17)
      at ResponseHelper.writeAuditLog [as error] (src/utils/response.helper.js:57:7)
      at PaymentController.error [as processInvestment] (src/controllers/payment.controller.js:32:35)
      at Object.processInvestment (test/unit/controllers/payment.controller.test.js:117:31)

  console.log
    🛑 Test Engine Shutdown: Database connection terminated cleanly.

      at Object.log (test/setup.js:88:13)

PASS test/unit/controllers/payment.controller.test.js (5.308 s)
  Payment & Pi Network Integration - Unit Tests
    Pi Network Infrastructure Constants
      ✓ API: Should verify Pi Network V2 and EscrowPi A2UaaS base endpoints (947 ms)
      ✓ Financials: Should enforce the mandatory 0.01 Pi network gas fee (205 ms)
      ✓ Security: Pi configuration object must be frozen to prevent tampering (246 ms)
    Investment Processing & Idempotency
      ✓ Success: Should process new investment and return 200 to the Frontend (297 ms)
      ✓ Security: Should block duplicate transactions (Idempotency Guard) (244 ms)
      ✓ Validation: Should reject requests with missing financial metadata (193 ms)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:00:57.455Z - [INFO]: MapCap Audit Engine v1.5.5 Synchronized for Cloud Deployment.
    [0m

      at log (src/config/logger.js:68:17)

  console.log
    
    🚀 Test Engine Connected: Remote Cloud (Termux-Ready)

      at Object.log (test/setup.js:47:15)

  console.log
    --- [FINANCIAL_JOB] Initiating Monthly Dividend Distribution ---

      at DividendJob.log [as distributeDividends] (src/jobs/dividend.job.js:25:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:01:00.780Z - [INFO]: Dividend Cycle Started. Total Pot: 10000 Pi
    [0m

      at log (src/config/logger.js:68:17)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T07:01:00.790Z - [WARN]: Anti-Whale Ceiling hit for Whale_Pioneer. Payout capped at 1000 Pi.
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at error (src/config/logger.js:66:17)
      at DividendJob.writeAuditLog [as distributeDividends] (src/jobs/dividend.job.js:57:21)
      at Object.<anonymous> (test/unit/jobs/dividend.job.test.js:70:7)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:01:00.799Z - [INFO]: Dividend Cycle Finalized. Total Pi Dispatched: 1100
    [0m

      at log (src/config/logger.js:68:17)

  console.log
    --- [SUCCESS] Distribution Cycle Complete. Total: 1100 Pi ---

      at DividendJob.log [as distributeDividends] (src/jobs/dividend.job.js:77:21)

  console.log
    --- [FINANCIAL_JOB] Initiating Monthly Dividend Distribution ---

      at DividendJob.log [as distributeDividends] (src/jobs/dividend.job.js:25:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:01:01.037Z - [INFO]: Dividend Cycle Started. Total Pot: 10000 Pi
    [0m

      at log (src/config/logger.js:68:17)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T07:01:01.052Z - [WARN]: Anti-Whale Ceiling hit for Whale_Pioneer. Payout capped at 1000 Pi.
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at error (src/config/logger.js:66:17)
      at DividendJob.writeAuditLog [as distributeDividends] (src/jobs/dividend.job.js:57:21)
      at Object.<anonymous> (test/unit/jobs/dividend.job.test.js:84:7)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:01:01.062Z - [INFO]: Dividend Cycle Finalized. Total Pi Dispatched: 1100
    [0m

      at log (src/config/logger.js:68:17)

  console.log
    --- [SUCCESS] Distribution Cycle Complete. Total: 1100 Pi ---

      at DividendJob.log [as distributeDividends] (src/jobs/dividend.job.js:77:21)

  console.log
    --- [FINANCIAL_JOB] Initiating Monthly Dividend Distribution ---

      at DividendJob.log [as distributeDividends] (src/jobs/dividend.job.js:25:17)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:01:01.344Z - [INFO]: Dividend Cycle Started. Total Pot: 10000 Pi
    [0m

      at log (src/config/logger.js:68:17)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T07:01:01.358Z - [CRITICAL]: Dividend Transfer FAILED for Normal_Pioneer: Network Timeout
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at error (src/config/logger.js:66:17)
      at DividendJob.writeAuditLog [as distributeDividends] (src/jobs/dividend.job.js:71:25)
      at Object.<anonymous> (test/unit/jobs/dividend.job.test.js:99:7)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T07:01:01.368Z - [WARN]: Anti-Whale Ceiling hit for Whale_Pioneer. Payout capped at 1000 Pi.
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at error (src/config/logger.js:66:17)
      at DividendJob.writeAuditLog [as distributeDividends] (src/jobs/dividend.job.js:57:21)
      at Object.<anonymous> (test/unit/jobs/dividend.job.test.js:99:7)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:01:01.378Z - [INFO]: Dividend Cycle Finalized. Total Pi Dispatched: 1000
    [0m

      at log (src/config/logger.js:68:17)

  console.log
    --- [SUCCESS] Distribution Cycle Complete. Total: 1000 Pi ---

      at DividendJob.log [as distributeDividends] (src/jobs/dividend.job.js:77:21)

  console.log
    🛑 Test Engine Shutdown: Database connection terminated cleanly.

      at Object.log (test/setup.js:88:13)

PASS test/unit/jobs/dividend.job.test.js (6.355 s)
  Tokenomics & Dividends - Unified Financial Tests
    Mint Configuration - Scarcity & Balance
      ✓ Supply: Should enforce 4M Hard-Cap and 2.18M IPO Pool target (891 ms)
      ✓ Balance: IPO and LP pools must mathematically equal the total mint (264 ms)
      ✓ Precision: Should strictly follow the 6-decimal global financial standard (229 ms)
      ✓ Security: Mint configuration object must be frozen at runtime (242 ms)
    Dividend Job - Proportional Payouts
      ✓ Distribution: Should calculate 1% share accurately for normal pioneers (276 ms)
      ✓ Anti-Whale: Should truncate whale dividends at 10% of the profit pot (304 ms)
      ✓ Fault Tolerance: Should continue processing if a single payment fails (276 ms)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:01:03.865Z - [INFO]: MapCap Audit Engine v1.5.5 Synchronized for Cloud Deployment.
    [0m

      at log (src/config/logger.js:68:17)

  console.log
    
    🚀 Test Engine Connected: Remote Cloud (Termux-Ready)

      at Object.log (test/setup.js:47:15)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T07:01:07.039Z - [ERROR]: [ERR-MLOTSIU7-VNN] Code: 400 | Message: Mandatory fields required: userWallet & amount.
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at error (src/config/logger.js:66:17)
      at ResponseHelper.writeAuditLog [as error] (src/utils/response.helper.js:57:7)
      at error (src/routes/api.js:76:31)
      at Object.withdrawHandler (test/unit/routes/api.routes.test.js:96:13)

  console.log
    🛑 Test Engine Shutdown: Database connection terminated cleanly.

      at Object.log (test/setup.js:88:13)

PASS test/unit/routes/api.routes.test.js (5.609 s)
  API & IPO Routing Architecture - Integrity Tests
    Global Stats & Health Endpoints
      ✓ Pulse: GET /stats should deliver synchronized scarcity engine metrics (1000 ms)
      ✓ Health: GET /status should confirm "Daniel_Audit_Ready" operational state (229 ms)
    Financial Transaction Mapping
      ✓ Payment: POST /invest must map to PaymentController logic (240 ms)
      ✓ A2UaaS: POST /withdraw should securely trigger PayoutService sequence (189 ms)
      ✓ Security: POST /withdraw should intercept and reject missing wallet parameters (237 ms)

  console.log
    
    🚀 Test Engine Connected: Remote Cloud (Termux-Ready)

      at Object.log (test/setup.js:47:15)

  console.log
    🛑 Test Engine Shutdown: Database connection terminated cleanly.

      at Object.log (test/setup.js:88:13)

PASS test/unit/models/transaction.model.test.js
  Transaction Model - Unified Audit Trail Integrity
    Mandatory Metadata & Financial Guards
      ✓ Validation: Should reject transactions missing address, amount, or type (622 ms)
      ✓ Financials: Should strictly reject negative transaction amounts (95 ms)
    Whale-Shield Compatibility & Lifecycle
      ✓ Compliance: Should support REFUND type for post-IPO ceiling adjustments (132 ms)
      ✓ Compliance: Should correctly categorize a VESTING_RELEASE transaction (112 ms)
      ✓ Defaults: Should default to PENDING status for new ledger entries (120 ms)
    Blockchain Traceability & Sync
      ✓ Integrity: Should store unique Pi Network TxID and memo (109 ms)
      ✓ Audit: Should verify that timestamps are enabled in the schema (115 ms)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:01:14.541Z - [INFO]: MapCap Audit Engine v1.5.5 Synchronized for Cloud Deployment.
    [0m

      at log (src/config/logger.js:68:17)

  console.log
    
    🚀 Test Engine Connected: Remote Cloud (Termux-Ready)

      at Object.log (test/setup.js:47:15)

  console.log
    [ADMIN_ACTION] Manual Post-IPO Settlement sequence initiated at 2026-02-16T07:01:16.267Z

      at AdminController.log [as triggerFinalSettlement] (src/controllers/admin/admin.controller.js:30:21)

  console.log
    [ADMIN_ACTION] Manual Post-IPO Settlement sequence initiated at 2026-02-16T07:01:17.062Z

      at AdminController.log [as triggerFinalSettlement] (src/controllers/admin/admin.controller.js:30:21)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T07:01:17.076Z - [ERROR]: [ERR-MLOTSQKZ-ANV] Code: 400 | Message: Settlement Aborted: No liquidity detected in the IPO pool.
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at error (src/config/logger.js:66:17)
      at ResponseHelper.writeAuditLog [as error] (src/utils/response.helper.js:57:7)
      at AdminController.error [as triggerFinalSettlement] (src/controllers/admin/admin.controller.js:56:39)
      at Object.<anonymous> (test/unit/controllers/admin.controller.test.js:84:7)

  console.log
    [ADMIN_ACTION] Manual Post-IPO Settlement sequence initiated at 2026-02-16T07:01:17.221Z

      at AdminController.log [as triggerFinalSettlement] (src/controllers/admin/admin.controller.js:30:21)

  console.log
    🛑 Test Engine Shutdown: Database connection terminated cleanly.

      at Object.log (test/setup.js:88:13)

PASS test/unit/controllers/admin.controller.test.js (5.687 s)
  Admin Command Center - Unified Integrity Tests
    Settlement Engine - Logic & Safety
      ✓ Execution: Should successfully trigger the Whale-Trim-Back protocol and return status (782 ms)
      ✓ Safety: Should abort settlement and return 400 if total Pi pool is empty (143 ms)
      ✓ Audit: Should report execution metrics within the data object for the Dashboard (150 ms)
    Admin Gateway - Security & Route Verification
      ✓ Auth: POST /login must be reachable for administrator entry (115 ms)
      ✓ Security: High-stakes endpoints like /status and /settle must be protected (116 ms)
      ✓ Compliance: GET /audit-logs must be accessible for Daniel’s review (118 ms)

  console.log
    
    🚀 Test Engine Connected: Remote Cloud (Termux-Ready)

      at Object.log (test/setup.js:47:15)

  console.log
    🛑 Test Engine Shutdown: Database connection terminated cleanly.

      at Object.log (test/setup.js:88:13)

PASS test/unit/models/investor.model.test.js (5.238 s)
  Investor Ecosystem - Unified Logic & Integrity Tests
    Core Schema Validation
      ✓ Validation: Should require a unique piAddress and block negative contributions (712 ms)
      ✓ Vesting: Should enforce the strict 10-month limit on completed tranches (201 ms)
      ✓ Audit: Should automatically track lastContributionDate on record creation (145 ms)
    Whale Identification & Boundary Logic
      ✓ Audit: Should accurately flag accounts exceeding the 10% ceiling (218,181.8) (149 ms)
      ✓ Boundary: Should not flag an account that is exactly at the 10% limit (139 ms)
    Virtual Properties & UI Protection
      ✓ Virtuals: sharePct must calculate correctly against the 2.18M supply (99 ms)
      ✓ Safety: remainingVesting must use Math.max to prevent negative asset display (127 ms)
    Provisioning & Seeding Logic
      ✓ Seeding: Should verify data purge and insertion of strategic profiles (104 ms)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:01:24.987Z - [INFO]: MapCap Audit Engine v1.5.5 Synchronized for Cloud Deployment.
    [0m

      at log (src/config/logger.js:68:17)

  console.log
    
    🚀 Test Engine Connected: Remote Cloud (Termux-Ready)

      at Object.log (test/setup.js:47:15)

  console.log
    🛑 Test Engine Shutdown: Database connection terminated cleanly.

      at Object.log (test/setup.js:88:13)

PASS test/unit/scripts/manual_trigger.test.js
  Manual Trigger - CLI Command Logic
    ✓ CLI Logic: Should accurately aggregate total pool from distributed records (743 ms)
    ✓ Action: WHALE_REFUND trigger should pass validated data to SettlementJob (131 ms)
    ✓ Safety: Should bypass settlement execution if total aggregated pool is zero (169 ms)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:01:29.646Z - [INFO]: MapCap Audit Engine v1.5.5 Synchronized for Cloud Deployment.
    [0m

      at log (src/config/logger.js:68:17)

  console.log
    
    🚀 Test Engine Connected: Remote Cloud (Termux-Ready)

      at Object.log (test/setup.js:47:15)

  console.log
    [AUTH_SUCCESS] Administrative session granted for: admin

      at AuthController.log [as adminLogin] (src/controllers/admin/auth.controller.js:54:21)

  console.warn
    [SECURITY_ALERT] Unauthorized login attempt for: admin

      69 |          * Logs unauthorized attempts with timestamps for threat analysis.
      70 |          */
    > 71 |         console.warn(`[SECURITY_ALERT] Unauthorized login attempt for: ${username}`);
         |                 ^
      72 |         
      73 |         return ResponseHelper.error(res, "Authentication failed: Invalid credentials.", 401);
      74 |     }

      at AuthController.warn [as adminLogin] (src/controllers/admin/auth.controller.js:71:17)
      at Object.adminLogin (test/unit/controllers/admin.auth.test.js:75:26)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T07:01:31.529Z - [ERROR]: [ERR-MLOTT1QH-TC9] Code: 401 | Message: Authentication failed: Invalid credentials.
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at error (src/config/logger.js:66:17)
      at ResponseHelper.writeAuditLog [as error] (src/utils/response.helper.js:57:7)
      at AuthController.error [as adminLogin] (src/controllers/admin/auth.controller.js:73:31)
      at Object.adminLogin (test/unit/controllers/admin.auth.test.js:75:26)

  console.log
    🛑 Test Engine Shutdown: Database connection terminated cleanly.

      at Object.log (test/setup.js:88:13)

PASS test/unit/controllers/admin.auth.test.js
  Admin Auth Controller - Security & Integrity Tests
    ✓ Login Success: Should generate a secure JWT for authorized administrative access (71 ms)
    ✓ Security: Should enforce strict 401 Unauthorized status for invalid credentials (20 ms)
    ✓ Telemetry: Should provide accurate operational status for the Pulse Dashboard (4 ms)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:01:33.484Z - [INFO]: MapCap Audit Engine v1.5.5 Synchronized for Cloud Deployment.
    [0m

      at log (src/config/logger.js:68:17)

  console.log
    
    🚀 Test Engine Connected: Remote Cloud (Termux-Ready)

      at Object.log (test/setup.js:47:15)

  console.log
    🛑 Test Engine Shutdown: Database connection terminated cleanly.

      at Object.log (test/setup.js:88:13)

PASS test/unit/utils/api.response.test.js
  Global API Consistency - Response & Error Resilience
    ResponseHelper - Output Formatting
      ✓ Success: Should return a 200 status with standardized data and timestamp (16 ms)
      ✓ Error Handling: Should generate a unique Trace ID prefixed with ERR- (8 ms)
    Error Middleware - Global Resilience & Privacy
      ✓ Capture: Should normalize unhandled exceptions to a 500 JSON response (36 ms)
      ✓ Security: Should hide sensitive stack traces in production mode (6 ms)
      ✓ Propagation: Should maintain the existing HTTP status code (e.g., 403 Forbidden) (3 ms)

  console.log
    
    🚀 Test Engine Connected: Remote Cloud (Termux-Ready)

      at Object.log (test/setup.js:47:15)

  console.log
    🛑 Test Engine Shutdown: Database connection terminated cleanly.

      at Object.log (test/setup.js:88:13)

PASS test/unit/utils/math.test.js
  MapCap Math Engine - Unit Tests
    ✓ Alpha Gain: Should calculate exactly 20% increase (11 ms)
    ✓ Whale-Shield: Should accurately flag stakes exceeding 10% threshold (3 ms)
    ✓ Precision: Should round to 6 decimal places with zero artifacts (2 ms)
    ✓ Resilience: Should return 0 for non-numerical inputs (3 ms)

  console.log
    
    🚀 Test Engine Connected: Remote Cloud (Termux-Ready)

      at Object.log (test/setup.js:47:15)

  console.log
    🛑 Test Engine Shutdown: Database connection terminated cleanly.

      at Object.log (test/setup.js:88:13)

PASS test/unit/utils/project.integrity.test.js
  Project Integrity - Architecture & Security Policy
    Dependency & Metadata Guard
      ✓ Metadata: Should align with stabilized v1.6.5 and ESM standards (13 ms)
      ✓ Runtime: Must enforce Node.js >=18.0.0 for Top-level Await support (2 ms)
      ✓ Stack: Should verify presence of Core Financial & Security libraries (7 ms)
      ✓ Scripts: Should define standardized Start/Dev entry points for Vercel (3 ms)
    Version Control Security Policy
      ✓ Security: Must strictly ignore .env files to prevent credential exposure (3 ms)
      ✓ Architecture: Should exclude node_modules and bulky log files (3 ms)
      ✓ Cleanliness: Should ignore IDE-specific metadata (.vscode, .DS_Store) (2 ms)

  console.log
    
    🚀 Test Engine Connected: Remote Cloud (Termux-Ready)

      at Object.log (test/setup.js:47:15)

  console.log
    🛑 Test Engine Shutdown: Database connection terminated cleanly.

      at Object.log (test/setup.js:88:13)

PASS test/unit/services/price.service.test.js
  PriceService - Dynamic Scarcity Engine Tests
    ✓ Integrity: Should verify the IPO supply is locked at exactly 2,181,818 (25 ms)
    ✓ Calculation: Should accurately calculate spot price as liquidity increases (5 ms)
    ✓ Safety: Should return 0 for zero, null, or negative liquidity inputs (3 ms)
    ✓ Formatting: Should standardize price to 6 decimal places for audit logs (4 ms)
    ✓ UI/UX: Should format price to 4 decimal places for dashboard readability (2 ms)
    ✓ Sanitization: Should handle invalid numerical strings gracefully (3 ms)

  console.log
    [32m[AUDIT_INFO] 2026-02-16T07:01:47.263Z - [INFO]: MapCap Audit Engine v1.5.5 Synchronized for Cloud Deployment.
    [0m

      at log (src/config/logger.js:68:17)

  console.log
    
    🚀 Test Engine Connected: Remote Cloud (Termux-Ready)

      at Object.log (test/setup.js:47:15)

  console.log
    [SECURITY_LOG] Admin access granted at 2026-02-16T07:01:48.936Z

      at log (src/middlewares/auth.middleware.js:35:17)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T07:01:49.002Z - [ERROR]: [ERR-MLOTTF7T-ODZ] Code: 400 | Message: Protocol Violation: Withdrawal must be within 0.01% to 100% range.
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at error (src/config/logger.js:66:17)
      at ResponseHelper.writeAuditLog [as error] (src/utils/response.helper.js:57:7)
      at error (src/middlewares/validate.middleware.js:40:31)
      at Object.validateWithdrawal (test/unit/middlewares/auth.middleware.test.js:88:7)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T07:01:49.014Z - [ERROR]: [ERR-MLOTTF86-WZ0] Code: 400 | Message: Protocol Violation: Withdrawal must be within 0.01% to 100% range.
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at error (src/config/logger.js:66:17)
      at ResponseHelper.writeAuditLog [as error] (src/utils/response.helper.js:57:7)
      at error (src/middlewares/validate.middleware.js:40:31)
      at Object.validateWithdrawal (test/unit/middlewares/auth.middleware.test.js:93:7)

  console.error
    [31m[AUDIT_ALERT] 2026-02-16T07:01:49.023Z - [ERROR]: [ERR-MLOTTF8F-1QK] Code: 400 | Message: Compliance Error: 'percentage' and 'userWallet' are mandatory.
    [0m

      64 |     // Real-time Console Output for Log Streaming (Vercel Dashboard Visibility)
      65 |     if (level === 'CRITICAL' || level === 'ERROR' || level === 'WARN') {
    > 66 |         console.error(`\x1b[31m[AUDIT_ALERT] ${entry}\x1b[0m`); // ANSI Red for Errors
         |                 ^
      67 |     } else {
      68 |         console.log(`\x1b[32m[AUDIT_INFO] ${entry}\x1b[0m`); // ANSI Green for Info
      69 |     }

      at error (src/config/logger.js:66:17)
      at ResponseHelper.writeAuditLog [as error] (src/utils/response.helper.js:57:7)
      at error (src/middlewares/validate.middleware.js:27:31)
      at Object.validateWithdrawal (test/unit/middlewares/auth.middleware.test.js:99:7)

  console.log
    🛑 Test Engine Shutdown: Database connection terminated cleanly.

      at Object.log (test/setup.js:88:13)

PASS test/unit/middlewares/auth.middleware.test.js
  API Guard - Security & Validation Unit Tests
    Admin Auth Middleware - Access Control
      ✓ Access: Should grant entry (next()) when a valid x-admin-token is provided (48 ms)
      ✓ Protection: Should return 403 Forbidden for invalid or missing tokens (13 ms)
    Withdrawal Validation - Financial Guard
      ✓ Integrity: Should parse and allow valid withdrawal percentages (e.g., 50%) (5 ms)
      ✓ Safety: Should reject missing metadata or out-of-range percentages (>100% or <=0%) (22 ms)
      ✓ Compliance: Should return 400 if the mandatory userWallet is missing (7 ms)

FAIL test/unit/models/admin.model.test.js
  ● Test suite failed to run

    Cannot find module '../../../src/models/admin.model.js' from 'test/unit/models/admin.model.test.js'

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)

Summary of all failing tests
FAIL test/integration/admin.ops.test.js (7.423 s)
  ● Admin Operations - Security & Settlement Integration › Settlement: POST /api/v1/admin/settle should execute with a valid admin token

    expect(received).toBe(expected) // Object.is equality

    Expected: 200
    Received: 403

      85 |       .set('Authorization', `Bearer ${adminToken}`);
      86 |
    > 87 |     expect(response.status).toBe(200);
         |                             ^
      88 |     expect(response.body.success).toBe(true);
      89 |     // Flexible matching for standardized success messages in v1.6.x
      90 |     expect(response.body.message).toMatch(/finalized|successfully|executed|settlement/i);

      at Object.toBe (test/integration/admin.ops.test.js:87:29)

  ● Admin Operations - Security & Settlement Integration › Audit: GET /api/v1/admin/status should return system metrics for Daniel’s review

    expect(received).toBe(expected) // Object.is equality

    Expected: 200
    Received: 403

      100 |       .set('Authorization', `Bearer ${adminToken}`);
      101 |
    > 102 |     expect(response.status).toBe(200);
          |                             ^
      103 |     expect(response.body.success).toBe(true);
      104 |     
      105 |     // Check for standardized data encapsulation for Dashboard compatibility

      at Object.toBe (test/integration/admin.ops.test.js:102:29)

FAIL test/integration/payout.pipeline.test.js (6.505 s)
  ● Payout Pipeline - End-to-End Financial Integration › Vesting Flow: Successful Pi transfer should update the investor ledger

    expect(received).toBe(expected) // Object.is equality

    Expected: 200
    Received: 404

      80 |     const updatedPioneer = await Investor.findById(pioneer._id);
      81 |     
    > 82 |     expect(response.status).toBe(200);
         |                             ^
      83 |     expect(paymentSpy).toHaveBeenCalled();
      84 |     expect(updatedPioneer.vestingMonthsCompleted).toBe(1);
      85 |     expect(updatedPioneer.lastPayoutTxId).toBe('PI_BLOCK_999');

      at Object.toBe (test/integration/payout.pipeline.test.js:82:29)

FAIL test/unit/jobs/settlement.job.test.js (5.394 s)
  ● Financial Lifecycle - Settlement & Vesting Unified Tests › Monthly Vesting - Release Logic › Calculation: Should release exactly 10% of equity per month

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: "Pioneer_001", 100, Any<String>
    Received: "Pioneer_001", 100

    Number of calls: 1

      105 |
      106 |       // Ensure PaymentService is called with correct distribution amount (1000 * 0.1)
    > 107 |       expect(PaymentService.transferPi).toHaveBeenCalledWith(
          |                                         ^
      108 |         'Pioneer_001', 
      109 |         100, 
      110 |         expect.any(String) 

      at Object.toHaveBeenCalledWith (test/unit/jobs/settlement.job.test.js:107:41)

FAIL test/integration/metrics.sync.test.js (5.542 s)
  ● Metrics Synchronization - System Pulse Integration › Sync: Should fetch external Pi price and update GlobalConfig pulse

    Property `fetchLatestPiPrice` does not exist in the provided object

      58 |     };
      59 |
    > 60 |     const priceSpy = jest.spyOn(PriceService, 'fetchLatestPiPrice')
         |                           ^
      61 |       .mockResolvedValue(mockPriceData);
      62 |
      63 |     // 2. Trigger the sync via the Admin/Cron endpoint

      at ModuleMocker.spyOn (node_modules/jest-mock/build/index.js:731:13)
      at Object.spyOn (test/integration/metrics.sync.test.js:60:27)

  ● Metrics Synchronization - System Pulse Integration › Resilience: Should retain last known price if external sync fails

    Property `fetchLatestPiPrice` does not exist in the provided object

      88 |
      89 |     // 2. Simulate external API failure (Timeout or Oracle Connectivity Error)
    > 90 |     jest.spyOn(PriceService, 'fetchLatestPiPrice')
         |          ^
      91 |       .mockRejectedValue(new Error('Oracle Offline'));
      92 |
      93 |     const response = await request(app)

      at ModuleMocker.spyOn (node_modules/jest-mock/build/index.js:731:13)
      at Object.spyOn (test/integration/metrics.sync.test.js:90:10)

FAIL test/integration/ipo.contribution.test.js (6.073 s)
  ● IPO Contribution Pipeline - Integration Tests › Success: POST /api/v1/ipo/invest should persist data and return 201 Created

    expect(received).toBe(expected) // Object.is equality

    Expected: 201
    Received: 400

      62 |       .send(contributionPayload);
      63 |
    > 64 |     expect(response.status).toBe(201);
         |                             ^
      65 |     expect(response.body.success).toBe(true);
      66 |     
      67 |     // Integrity Check: Verifying data persistence in the ledger

      at Object.toBe (test/integration/ipo.contribution.test.js:64:29)

  ● IPO Contribution Pipeline - Integration Tests › Security: Should reject duplicate txId to prevent double-entry

    expect(received).toMatch(expected)

    Expected pattern: /duplicate|already exists/i
    Received string:  "Missing transaction metadata: 'piAddress', 'amount', and 'piTxId' are required."

      89 |
      90 |     expect(response.status).toBe(400);
    > 91 |     expect(response.body.message).toMatch(/duplicate|already exists/i);
         |                                   ^
      92 |   });
      93 |
      94 |   /**

      at Object.toMatch (test/integration/ipo.contribution.test.js:91:35)

FAIL test/unit/models/admin.model.test.js
  ● Test suite failed to run

    Cannot find module '../../../src/models/admin.model.js' from 'test/unit/models/admin.model.test.js'

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)


Test Suites: 6 failed, 17 passed, 23 total
Tests:       8 failed, 103 passed, 111 total
Snapshots:   0 total
Time:        116.681 s, estimated 197 s
Ran all test suites.
