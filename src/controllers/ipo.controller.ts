/**
 * MapCap IPO Controller - High-Precision Financial Engine v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Post-IPO Compliance
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Implemented strict typing for global aggregation and user metrics.
 * - Maintained legacy 'v1-v4' mapping for total Frontend stability.
 * - Added explicit Request/Response types from Express.
 */

import { Request, Response } from 'express';
import Investor from '../models/investor.model.js';
import MathHelper from '../utils/math.helper.js';
import ResponseHelper from '../utils/response.helper.js';

/**
 * @interface IpoScreenStats
 * Contract for the Pulse Dashboard UI data binding.
 */
interface IpoScreenStats {
    values: {
        v1_totalInvestors: number;
        v2_totalPool: string;
        v3_userStake: string;
        v4_capitalGain: string;
        currentSpotPrice: string;
    };
    compliance: {
        isWhale: boolean;
        sharePercentage: string;
        status: "PENDING_FINAL_SETTLEMENT" | "COMPLIANT";
    };
    vesting: {
        completed: number;
        remaining: number;
        nextRelease: string;
    };
}

class IpoController {
    /**
     * @method getScreenStats
     * @desc Delivers Values 1-4 for the IPO Pulse UI.
     */
    static async getScreenStats(req: Request, res: Response): Promise<void> {
        try {
            /**
             * IDENTITY RESOLUTION:
             * Resolves user identity from the authenticated request object.
             */
            const piAddress: string = req.user?.uid || req.user?.username; 

            /**
             * STEP 1: GLOBAL LIQUIDITY AGGREGATION
             */
            const globalMetrics = await Investor.aggregate([
                { 
                    $group: { 
                        _id: null, 
                        totalPi: { $sum: "$totalPiContributed" }, 
                        investorCount: { $sum: 1 } 
                    } 
                }
            ]);

            const totalPiInvested: number = globalMetrics[0]?.totalPi || 0;
            const totalInvestors: number = globalMetrics[0]?.investorCount || 0;

            /**
             * STEP 2: INDIVIDUAL LEDGER SYNC
             */
            const pioneer = await Investor.findOne({ piAddress });
            const userPiBalance: number = pioneer ? pioneer.totalPiContributed : 0;

            /**
             * STEP 3: DYNAMIC SPOT PRICE (Philip's Scarcity Formula)
             * Formula: Total MAPCAP IPO Supply / Current Pool Liquidity.
             */
            const IPO_MAPCAP_SUPPLY: number = 2181818;
            const spotPrice: number = totalPiInvested > 0 
                ? (IPO_MAPCAP_SUPPLY / totalPiInvested) 
                : 0; 

            /**
             * STEP 4: ALPHA GAIN & COMPLIANCE MONITORING
             */
            const userCapitalGain: number = MathHelper.calculateAlphaGain(userPiBalance);
            const userSharePct: number = MathHelper.getPercentage(userPiBalance, totalPiInvested);
            
            const isWhale: boolean = userSharePct > 10.0;

            /**
             * STEP 5: STANDARDIZED SUCCESS RESPONSE
             * Strict preservation of v1-v4 keys for Dashboard parity.
             */
            const responseData: IpoScreenStats = {
                values: {
                    v1_totalInvestors: totalInvestors,            
                    v2_totalPool: MathHelper.formatCurrency(totalPiInvested),           
                    v3_userStake: MathHelper.formatCurrency(userPiBalance), 
                    v4_capitalGain: MathHelper.formatCurrency(userCapitalGain),
                    currentSpotPrice: MathHelper.formatCurrency(spotPrice, 6)
                },
                compliance: {
                    isWhale,
                    sharePercentage: `${userSharePct}%`,
                    status: isWhale ? "PENDING_FINAL_SETTLEMENT" : "COMPLIANT"
                },
                vesting: {
                    completed: pioneer?.vestingMonthsCompleted || 0,
                    remaining: 10 - (pioneer?.vestingMonthsCompleted || 0),
                    nextRelease: "Scheduled: 1st of next month"
                }
            };

            return ResponseHelper.success(res, "Financial Ledger Synchronized", responseData);

        } catch (error: any) {
            console.error(`[CRITICAL_CONTROLLER_ERROR]: ${error.message}`);
            return ResponseHelper.error(res, "Dashboard Sync Failed: Financial Pipeline Offline", 500);
        }
    }
}

export default IpoController;
