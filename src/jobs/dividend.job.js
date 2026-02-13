/**
 * Dividend Job - Automated Profit Sharing & Compliance Engine v1.2
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings (Page 5-6)
 * * PURPOSE: 
 * Automated 10% profit distribution with integrated Anti-Whale logic.
 * Ensures decentralization by capping individual payouts at 10% per cycle.
 * ---------------------------------------------------------
 */

import Investor from '../models/investor.model.js';
import PaymentService from '../services/payment.service.js';
import { writeAuditLog } from '../config/logger.js';

class DividendJob {
    /**
     * @method distributeDividends
     * @param {number} totalProfitPot - The 10% profit slice from Map of Pi.
     * @desc Calculates and transfers Pi rewards via A2UaaS protocol.
     */
    static async distributeDividends(totalProfitPot) {
        console.log("--- [FINANCIAL_JOB] Initiating Dividend Distribution Cycle ---");
        writeAuditLog('INFO', `Dividend Cycle Started. Total Pot: ${totalProfitPot} Pi`);

        try {
            // Fetching active MapCap holders
            const investors = await Investor.find({ totalPiContributed: { $gt: 0 } });
            
            const IPO_MAPCAP_POOL = 2181818; 
            const WHALE_DIVIDEND_CEILING = totalProfitPot * 0.10; // 10% Cap per Requirement 92

            let totalDistributed = 0;

            for (const investor of investors) {
                /**
                 * 1. PROPORTIONAL CALCULATION
                 * Share = (User's MapCap / Total Supply) * Available Profit Pot
                 */
                let share = (investor.allocatedMapCap / IPO_MAPCAP_POOL) * totalProfitPot;

                /**
                 * 2. ANTI-WHALE ENFORCEMENT
                 * Truncates payouts exceeding the 10% threshold to prevent pool drainage.
                 */
                if (share > WHALE_DIVIDEND_CEILING) {
                    writeAuditLog('WARN', `Anti-Whale triggered for ${investor.piAddress}. Capped at ${WHALE_DIVIDEND_CEILING} Pi.`);
                    share = WHALE_DIVIDEND_CEILING;
                }

                // 3. BLOCKCHAIN EXECUTION (A2UaaS)
                if (share > 0) {
                    try {
                        await PaymentService.transferPi(investor.piAddress, share);
                        totalDistributed += share;
                    } catch (paymentErr) {
                        writeAuditLog('CRITICAL', `Payment failed for ${investor.piAddress}: ${paymentErr.message}`);
                        // Continue to next investor to prevent job stalling
                    }
                }
            }

            

            writeAuditLog('INFO', `Dividend Cycle Completed. Total Distributed: ${totalDistributed} Pi.`);
            console.log(`--- [SUCCESS] Total Distributed in this cycle: ${totalDistributed} Pi ---`);

        } catch (error) {
            writeAuditLog('CRITICAL', `Dividend Job Fatal Error: ${error.message}`);
            console.error("[CRITICAL_ERROR]: Dividend Job Aborted.");
        }
    }
}

export default DividendJob;
