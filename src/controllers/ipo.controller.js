/**
 * MapCap IPO Controller - High-Precision Financial Engine v1.7.6
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Post-IPO Compliance
 * ---------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Powers the 'Pulse Dashboard' by aggregating global liquidity.
 * Implements the scarcity-based Spot Price logic and provides real-time 
 * transparency for Pioneers while ensuring zero Frontend breakage.
 * ---------------------------------------------------------
 */

import Investor from '../models/investor.model.js';
import MathHelper from '../utils/math.helper.js';
import ResponseHelper from '../utils/response.helper.js';

class IpoController {
    /**
     * @method getScreenStats
     * @desc Delivers Values 1-4 for the IPO Pulse UI.
     * Synchronizes individual stakes with the global scarcity model.
     * @access Private (Authenticated Pioneer)
     */
    static async getScreenStats(req, res) {
        try {
            /**
             * IDENTITY RESOLUTION:
             * Resolves the Pioneer's UID for real-time ledger synchronization.
             */
            const piAddress = req.user?.uid || req.user?.username; 

            // 1. GLOBAL AGGREGATION: Calculating the 'Water-Level' [Spec Page 4]
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

            // 2. INDIVIDUAL LEDGER SYNC: Fetching personalized contribution data
            const pioneer = await Investor.findOne({ piAddress });
            const userPiBalance = pioneer ? pioneer.totalPiContributed : 0;

            /**
             * 3. DYNAMIC SPOT PRICE (Philip's Scarcity Formula)
             * Formula: Total MAPCAP IPO Supply (2,181,818) / Current Pool Liquidity.
             * This creates the "Value 2" scarcity metric.
             */
            const IPO_MAPCAP_SUPPLY = 2181818;
            const spotPrice = totalPiInvested > 0 
                ? (IPO_MAPCAP_SUPPLY / totalPiInvested) 
                : 0; 

            /**
             * 4. ALPHA GAIN & WHALE SHIELD MONITORING
             * Logic: We monitor the 10% ceiling without enforcing hard-locks 
             * during the IPO, as the pool total is continuously fluctuating.
             */
            const userCapitalGain = MathHelper.calculateAlphaGain(userPiBalance);
            const userSharePct = MathHelper.getPercentage(userPiBalance, totalPiInvested);
            
            // Per Philip's Use Case: isWhale is an advisory status until the 4-week cycle ends.
            const isWhale = userSharePct > 10.0;

            /**
             * 5. SUCCESS RESPONSE: Data Delivery for Dashboard.jsx
             * KEY: Variable names (v1, v2, v3, v4) are preserved for 100% Frontend stability.
             */
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
                    // Informative status: Actual enforcement occurs at Post-IPO Settlement.
                    status: isWhale ? "PENDING_FINAL_SETTLEMENT" : "COMPLIANT"
                },
                vesting: {
                    completed: pioneer?.vestingMonthsCompleted || 0,
                    remaining: 10 - (pioneer?.vestingMonthsCompleted || 0),
                    nextRelease: "Scheduled: 1st of next month"
                }
            });

        } catch (error) {
            /**
             * CRITICAL EXCEPTION LOGGING:
             * Ensures pipeline failures are visible for Daniel's monitoring.
             */
            console.error(`[CRITICAL_CONTROLLER_ERROR]: ${error.message}`);
            return ResponseHelper.error(res, "Dashboard Sync Failed: Financial Pipeline Offline", 500);
        }
    }
}

export default IpoController;
