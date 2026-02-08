/**
 * Dividend Job - Profit Sharing & Anti-Whale Enforcement
 * ---------------------------------------------------------
 * [span_10](start_span)Transfers 10% of Map of Pi profits to MapCap holders.[span_10](end_span)
 * [span_11](start_span)Enforces a 10% maximum dividend cap per pioneer to discourage whales.[span_11](end_span)
 */

const PaymentService = require('../services/payment.service');
const Investor = require('../models/Investor');

class DividendJob {
    /**
     * Distributes dividends based on current MapCap holdings.
     * [span_12](start_span)@param {number} totalProfitPot - The total 10% of Map of Pi profit allocated for distribution.[span_12](end_span)
     */
    static async distributeDividends(totalProfitPot) {
        console.log("--- [SYSTEM] Initiating Dividend Distribution ---");

        try {
            const investors = await Investor.find({ totalPiContributed: { $gt: 0 } });
            
            [span_13](start_span)// Total MapCap held by all pioneers for proportional calculation[span_13](end_span)
            const totalMapCapHeld = 2181818; [span_14](start_span)// IPO MapCap pool[span_14](end_span)
            const DIVIDEND_CAP_LIMIT = totalProfitPot * 0.10; [span_15](start_span)// Max 10% of the pot per person[span_15](end_span)

            for (const investor of investors) {
                [span_16](start_span)// Calculate proportional share[span_16](end_span)
                let share = (investor.allocatedMapCap / totalMapCapHeld) * totalProfitPot;

                /**
                 * Anti-Whale Logic:
                 * [span_17](start_span)If share exceeds 10% of the pot, trim it back to 10%.[span_17](end_span)
                 * [span_18](start_span)Excess is returned to the dividend pot for others.[span_18](end_span)
                 */
                if (share > DIVIDEND_CAP_LIMIT) {
                    console.log(`[WHALE CAP] Trimming dividend for ${investor.piAddress}`);
                    share = DIVIDEND_CAP_LIMIT;
                }

                if (share > 0) {
                    await PaymentService.transferPi(investor.piAddress, share);
                }
            }
            console.log("--- [SUCCESS] Dividend Distribution Completed ---");
        } catch (error) {
            console.error("[CRITICAL] Dividend Job Failure:", error.message);
        }
    }
}

module.exports = DividendJob;

