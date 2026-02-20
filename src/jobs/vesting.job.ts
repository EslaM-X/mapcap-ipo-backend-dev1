/**
 * Vesting Job - IPO Token Release Engine v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Linear Distribution Model
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Added strict typing for Mongoose investor documents.
 * - Formalized the monthly release calculation with MathHelper integration.
 * - Maintained audit log severities for Daniel's compliance reports.
 */

import Investor from '../models/investor.model.js';
import PaymentService from '../services/payment.service.js';
import MathHelper from '../utils/math.helper.js';
import { writeAuditLog } from '../config/logger.js';

class VestingJob {
    /**
     * @method executeMonthlyVesting
     * @description Orchestrates the 10-month linear release (10% per month).
     * Only processes compliant investors (Non-Whales) as per Philip's Spec.
     */
    static async executeMonthlyVesting(): Promise<void> {
        console.log("🕒 --- [VESTING_ENGINE] Monthly Distribution Cycle Started ---");
        writeAuditLog('INFO', 'Vesting Engine: Monthly Tranche Release Initiated.');

        try {
            /**
             * 1. PIONEER SELECTION FILTER
             * Targets investors with remaining tranches and compliant status.
             */
            const investors = await Investor.find({ 
                totalPiContributed: { $gt: 0 },
                vestingMonthsCompleted: { $lt: 10 },
                isWhale: false // Critical: Post-settlement compliance check
            });

            if (investors.length === 0) {
                console.log("ℹ️ [SYSTEM] Idle State: No pending vesting tranches detected.");
                return;
            }

            for (const investor of investors) {
                /**
                 * 2. PROPORTIONAL CALCULATION (10% Monthly)
                 * Uses high-precision math for Pi currency stability.
                 */
                const monthlyRelease: number = MathHelper.toPiPrecision(investor.allocatedMapCap * 0.10);

                if (monthlyRelease > 0) {
                    try {
                        /**
                         * 3. BLOCKCHAIN SETTLEMENT (A2UaaS)
                         */
                        await PaymentService.transferPi(investor.piAddress, monthlyRelease);
                        
                        /**
                         * 4. LEDGER SYNCHRONIZATION
                         */
                        investor.vestingMonthsCompleted += 1;
                        investor.lastContributionDate = new Date();
                        await investor.save();

                        writeAuditLog('INFO', `[TRANCHE_RELEASED] ${investor.vestingMonthsCompleted}/10 to ${investor.piAddress}`);
                        
                    } catch (err: any) {
                        writeAuditLog('CRITICAL', `[PAYOUT_FAILURE] ${investor.piAddress}: ${err.message}`);
                        console.error(`❌ [PIPELINE_ERROR] Payment failed for ${investor.piAddress}`);
                    }
                }
            }

            console.log("🏁 --- [SUCCESS] Monthly Vesting Cycle Finalized ---");
        } catch (error: any) {
            writeAuditLog('CRITICAL', `[FATAL_SYSTEM_ERROR] Vesting Job Crash: ${error.message}`);
            throw error;
        }
    }
}

export default VestingJob;
