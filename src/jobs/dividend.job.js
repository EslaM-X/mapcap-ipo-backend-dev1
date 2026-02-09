/**
 * Dividend Job - Automated Profit Sharing & Compliance Engine
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings (Page 5-6)
 * * PURPOSE: 
 * Executes the 10% profit distribution from Map of Pi to MapCap holders.
 * Integrates the 'Anti-Whale Dividend Cap' to ensure no single entity
 * captures more than 10% of any given distribution cycle.
 * ---------------------------------------------------------
 */

import Investor from '../models/investor.model.js';
// Note: PaymentService will be migrated to ES Modules in the next step
import PaymentService from '../services/payment.service.js';

class DividendJob {
    /**
     * @method distributeDividends
     * @param {number} totalProfitPot - The 10% profit slice from Map of Pi.
     * @desc Calculates and transfers Pi rewards based on proportional MapCap equity.
     */
    static async distributeDividends(totalProfitPot) {
        console.log("--- [FINANCIAL_JOB] Initiating Dividend Distribution Cycle ---");

        try {
            // Fetching all active participants with a stake in the IPO
            const investors = await Investor.find({ totalPiContributed: { $gt: 0 } });
            
            // Constants as per Page 2 & 6 of the project specification
            const IPO_MAPCAP_POOL = 2181818; 
            const WHALE_DIVIDEND_CEILING = totalProfitPot * 0.10; // 10% Max Cap per wallet

            for (const investor of investors) {
                /**
                 * 1. PROPORTIONAL CALCULATION
                 * Share = (User's Allocated MapCap / Total IPO Pool) * Total Profit Pot
                 */
                let share = (investor.allocatedMapCap / IPO_MAPCAP_POOL) * totalProfitPot;

                /**
                 * 2. ANTI-WHALE LOGIC (Requirement 92-94)
                 * If the calculated share exceeds the 10% ceiling, it is truncated.
                 * This ensures decentralization and prevents 'Whale' dominance.
                 */
                if (share > WHALE_DIVIDEND_CEILING) {
                    console.warn(`[ANTI_WHALE]: Capping dividend for ${investor.piAddress} at 10%`);
                    share = WHALE_DIVIDEND_CEILING;
                }

                // 3. EXECUTION
                if (share > 0) {
                    // Triggering the Pi Network Payment SDK via PaymentService
                    await PaymentService.transferPi(investor.piAddress, share);
                }
            }
            console.log("--- [SUCCESS] Dividend Distribution Cycle Completed Successfully ---");
        } catch (error) {
            console.error("[CRITICAL_ERROR]: Dividend Job Aborted -", error.message);
            // Critical failures are usually handled by the server's global error interceptor
        }
    }
}

export default DividendJob;
