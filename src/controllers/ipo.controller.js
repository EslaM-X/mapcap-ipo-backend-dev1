/**
 * MapCap IPO Controller - High-Precision Financial Engine v1.7
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel
 * * OPERATIONAL OVERVIEW:
 * Powers the 'Pulse Dashboard' by aggregating global liquidity 
 * and enforcing the 10% Anti-Whale compliance protocol.
 * ---------------------------------------------------------
 */

import Investor from '../models/investor.model.js';
import MathHelper from '../utils/math.helper.js';
import ResponseHelper from '../utils/response.helper.js';

class IpoController {
    /**
     * @method getScreenStats
     * @desc Delivers Value 1-4 for the IPO Pulse UI.
     * Synchronizes individual stakes with the global scarcity model.
     */
    static async getScreenStats(req, res) {
        try {
            /**
             * IDENTITY RESOLUTION:
             * In production, req.user is populated by the AuthMiddleware 
             * after verifying the Pi Network Scopes.
             */
            const piAddress = req.user?.uid || req.user?.username; 

            // 1. GLOBAL AGGREGATION: The 'Water-Level' [Spec Page 4]
            const globalMetrics = await Investor.aggregate([
                { 
                    $group: { 
                        _id: null, 
                        totalPi: { $sum: "$totalPiContributed" }, 
                        investorCount: { $sum: 1 } 
                    } 
                }
            ]);

            const totalPiInvested = globalMetrics[0]?.totalPi || 0;
            const totalInvestors = globalMetrics[0]?.investorCount || 0;

            // 2. INDIVIDUAL LEDGER SYNC
            const pioneer = await Investor.findOne({ piAddress });
            const userPiBalance = pioneer ? pioneer.totalPiContributed : 0;

            /**
             * 3. DYNAMIC SPOT PRICE (Philip's Scarcity Formula)
             * Logic: Total Supply (2,181,818) / Current Pool Liquidity.
             */
            const IPO_MAPCAP_SUPPLY = 2181818;
            const spotPrice = totalPiInvested > 0 
                ? (IPO_MAPCAP_SUPPLY / totalPiInvested) 
                : 0; 

            /**
             * 4. ALPHA GAIN & WHALE-SHIELD MONITORING
             * Leveraging MathHelper for audit-ready precision.
             */
            const userCapitalGain = MathHelper.calculateAlphaGain(userPiBalance);
            const userSharePct = MathHelper.getPercentage(userPiBalance, totalPiInvested);
            const isWhale = userSharePct > 10.0;

            

            // 5. SUCCESS RESPONSE: Data Delivery for Dashboard.jsx
            return ResponseHelper.success(res, "Financial Ledger Synchronized", {
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
                    status: isWhale ? "WHALE_CAP_ACTIVE" : "COMPLIANT"
                },
                vesting: {
                    completed: pioneer?.vestingMonthsCompleted || 0,
                    remaining: 10 - (pioneer?.vestingMonthsCompleted || 0),
                    nextRelease: "1st of next month (UTC)"
                }
            });

        } catch (error) {
            console.error(`[CRITICAL_CONTROLLER_ERROR]: ${error.message}`);
            return ResponseHelper.error(res, "Dashboard Sync Failed: Financial Pipeline Offline", 500);
        }
    }
}

export default IpoController;
