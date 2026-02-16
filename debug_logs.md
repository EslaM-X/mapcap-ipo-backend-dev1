# MapCap IPO Backend - Error Log v1.0

## 1. Environment Issues (Termux)
- **Issue:** MongoBinaryDownload fails to fetch MongoDB binary.
- **Trace:** node_modules/mongodb-memory-server-core/src/util/MongoBinaryDownload.ts
- **Impact:** Prevents running 'payment.spec.ts'.

## 2. Test Suite Failures (Jest)
- **Error 1:** Property 'fetchLatestPiPrice' does not exist in PriceService.
  - *Location:* test/integration/metrics.sync.test.js:96:10
- **Error 2:** Cannot find module '@jest/globals'.
  - *Location:* test/integration/ipo.contribution.test.js
- **Summary:** 6 failed suites, 9 failed tests.
