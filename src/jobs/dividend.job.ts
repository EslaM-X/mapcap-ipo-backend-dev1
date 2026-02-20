/**
 * Dividend Job - Automated Profit Sharing & Compliance Engine v1.7.5 (TS)
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings (Page 5-6)
 * ---------------------------------------------------------
 * ARCHITECTURAL ROLE: 
 * Orchestrates the automated 10% profit distribution lifecycle.
 * Implements the "Decentralization Safety Valve" by capping individual 
 * rewards at 10% of the total profit pot per cycle.
 * ---------------------------------------------------------
 */

import Investor from '../models/investor.model.js';
import PaymentService from '../services/payment.service.js';
import { writeAuditLog } from '../config/logger.js';

class DividendJob {
    /**
     * @method distributeDividends
     * @param totalProfitPot - The 10% profit slice allocated for distribution.
     * @desc Calculates and transfers Pi rewards via the A2UaaS protocol.
     */
    static async distributeDividends(totalProfitPot: number): Promise<void> {
        console.log("--- [FINANCIAL_JOB] Initiating Monthly Dividend Distribution ---");
        writeAuditLog('INFO', `Dividend Cycle Started. Total Pot: ${totalProfitPot} Pi`);

        try {
            // Fetching active MapCap equity holders (Investors with actual stakes)
            const investors = await Investor.find({ totalPiContributed: { $gt: 0 } });
            
            // Core Scarcity Constant for share calculations (Value 2 Foundation)
            const IPO_MAPCAP_POOL: number = 2181818; 

            /**
             * ANTI-WHALE DIVIDEND CEILING (Requirement 92):
             * Limits any single payout to 10% of the current Profit Pot.
             * This ensures that rewards are distributed across a decentralized base.
             */
            const WHALE_DIVIDEND_CEILING: number = totalProfitPot * 0.10; 

            let totalDistributedInCycle: number = 0;

            for (const investor of investors) {
                /**
                 * 1. EQUITY-BASED PROPORTIONAL CALCULATION
                 * Share = (User's Allocated MapCap / Total Supply) * Available Profit Pot
                 */
                let share: number = (investor.allocatedMapCap / IPO_MAPCAP_POOL) * totalProfitPot;

                /**
                 * 2. REWARD CAPPING (Anti-Whale Enforcement)
                 * Truncates payouts that exceed the 10% threshold to prevent pool drainage 
                 * by large stakeholders, maintaining ecosystem health.
                 */
                if (share > WHALE_DIVIDEND_CEILING) {
                    writeAuditLog('WARN', `Anti-Whale Ceiling hit for ${investor.piAddress}. Payout capped at ${WHALE_DIVIDEND_CEILING} Pi.`);
                    share = WHALE_DIVIDEND_CEILING;
                }

                /**
                 * 3. BLOCKCHAIN EXECUTION (A2UaaS)
                 * Dispatches the finalized share via the App-to-User transfer protocol.
                 */
                if (share > 0) {
                    try {
                        await PaymentService.transferPi(investor.piAddress, share, 'MONTHLY_DIVIDEND_PAYOUT');
                        totalDistributedInCycle += share;
                    } catch (paymentErr: any) {
                        // Daniel's Requirement: Log payment failures without stalling the entire queue
                        writeAuditLog('CRITICAL', `Dividend Transfer FAILED for ${investor.piAddress}: ${paymentErr.message}`);
                    }
                }
            }

            writeAuditLog('INFO', `Dividend Cycle Finalized. Total Pi Dispatched: ${totalDistributedInCycle}`);
            console.log(`--- [SUCCESS] Distribution Cycle Complete. Total: ${totalDistributedInCycle} Pi ---`);

        } catch (error: any) {
            /**
             * FATAL EXCEPTION HANDLING:
             * Prevents job crashes and logs errors for immediate administrative review.
             */
            writeAuditLog('CRITICAL', `Dividend Job Engine Failure: ${error.message}`);
            console.error("[CRITICAL_ERROR]: Dividend Engine Aborted.");
        }
    }
}

export default DividendJob;
