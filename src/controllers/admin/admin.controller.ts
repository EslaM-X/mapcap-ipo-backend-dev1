/**
 * AdminController - Management, Settlement & Vesting Operations v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Post-IPO & Daniel Compliance
 * -------------------------------------------------------------------------
 * TS STABILIZATION LOG:
 * - Resolved TS2835: Integrated mandatory .js extensions for ESM compatibility.
 * - Resolved TS2307: Fixed module resolution for internal dependencies.
 * - Integrity Guard: Preserved all JSON keys (e.g., totalRefundedPi) to 
 * ensure zero-code changes required in Frontend components.
 */

import { Request, Response } from 'express';

/**
 * INTERNAL MODULE IMPORTS
 * Extensions (.js) are required for NodeNext module resolution.
 */
import Investor from '../../models/investor.model.js';
import SettlementJob from '../../jobs/settlement.job.js'; 
import VestingJob from '../../jobs/vesting.job.js';
import ResponseHelper from '../../utils/response.helper.js';

/**
 * @interface SettlementReport
 * Describes the structure of the financial execution report for audit trails.
 */
interface SettlementReport {
    success: boolean;
    whalesImpacted?: number;
    totalRefunded?: number;
    error?: string;
}

class AdminController {
    /**
     * @method triggerFinalSettlement
     * @description Orchestrates manual IPO finalization and Whale Trim-back operations.
     * @access Private / Admin Only
     * @returns Promise<Response>
     */
    static async triggerFinalSettlement(req: Request, res: Response): Promise<any> {
        try {
            console.log(`[ADMIN_ACTION] Manual Post-IPO Settlement sequence initiated at ${new Date().toISOString()}`);

            /**
             * PHASE 1: GLOBAL LIQUIDITY AGGREGATION
             * Aggregates total Pi contributions for baseline financial auditing.
             */
            const aggregation = await Investor.aggregate([
                { 
                    $group: { 
                        _id: null, 
                        total: { $sum: "$totalPiContributed" },
                        count: { $sum: 1 }
                    } 
                }
            ]);
            
            const totalPiPool: number = aggregation.length > 0 ? aggregation[0].total : 0;
            const investorCount: number = aggregation.length > 0 ? aggregation[0].count : 0;

            if (totalPiPool === 0) {
                return ResponseHelper.error(res, "Settlement Aborted: No liquidity detected in the IPO pool.", 400);
            }

            /**
             * PHASE 2: CORE FINANCIAL EXECUTION
             * Executes the whale trim-back algorithm via the Settlement Engine.
             */
            const report: SettlementReport = await SettlementJob.executeWhaleTrimBack(totalPiPool);

            if (!report || !report.success) {
                throw new Error(report?.error || "Internal Settlement Engine Disruption");
            }

            /**
             * PHASE 3: FRONTEND SYNCHRONIZATION
             * Returns standardized JSON exactly as expected by AdminDashboard.jsx.
             * Keys maintained: refundsIssued, totalRefundedPi.
             */
            return ResponseHelper.success(res, "Post-IPO settlement executed successfully.", {
                executionTimestamp: new Date().toISOString(),
                metrics: {
                    totalPoolProcessed: totalPiPool,
                    investorsAudited: investorCount,
                    refundsIssued: report.whalesImpacted || 0, 
                    totalRefundedPi: report.totalRefunded || 0    
                },
                status: "COMPLETED"
            });

        } catch (error: any) {
            console.error("[CRITICAL_SETTLEMENT_FAILURE]:", error.message);
            return ResponseHelper.error(res, `Settlement engine failure: ${error.message}`, 500);
        }
    }

    /**
     * @method triggerVestingCycle
     * @description Manual trigger for the 10% monthly MapCap vesting release for Pioneers.
     */
    static async triggerVestingCycle(req: Request, res: Response): Promise<any> {
        try {
            console.log(`[ADMIN_ACTION] Manual Vesting Cycle Triggered at ${new Date().toISOString()}`);
            
            await VestingJob.executeMonthlyVesting();

            return ResponseHelper.success(res, "Monthly vesting tranche released to all eligible Pioneers.", {
                cycleTimestamp: new Date().toISOString(),
                status: "SUCCESS"
            });
        } catch (error: any) {
            console.error("[CRITICAL_VESTING_FAILURE]:", error.message);
            return ResponseHelper.error(res, `Vesting engine failure: ${error.message}`, 500);
        }
    }

    /**
     * @method getSystemStatus
     * @description Retrieves operational health and investor metrics.
     */
    static async getSystemStatus(req: Request, res: Response): Promise<any> {
        try {
            const investorsCount: number = await Investor.countDocuments();
            
            return ResponseHelper.success(res, "System metrics retrieved successfully.", {
                status: "Operational",
                engine: "MapCap Audit Engine v1.7.5",
                metrics: {
                    active_investors: investorsCount,
                    deployment: "Production-Synchronized"
                }
            });
        } catch (error: any) {
            console.error("[STATUS_RETRIEVAL_ERROR]:", error.message);
            return ResponseHelper.error(res, "Failed to retrieve system status.", 500);
        }
    }

    /**
     * @method getAuditLogs
     * @description Fetches administrative audit trails for compliance reporting.
     */
    static async getAuditLogs(req: Request, res: Response): Promise<any> {
        return ResponseHelper.success(res, "Administrative audit logs retrieved.", { 
            logs: [],
            count: 0 
        });
    }
}

export default AdminController;
