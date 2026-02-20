/**
 * MapCap IPO Controller - High-Precision Financial Engine v1.7.8
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Post-IPO Compliance
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Powers the 'Pulse Dashboard' by aggregating global liquidity metrics.
 * Implements the scarcity-based Spot Price logic and provides real-time 
 * transparency for Pioneers while ensuring 100% Frontend stability.
 * -------------------------------------------------------------------------
 * UPDATES:
 * - Parity Guard: Maintained v1-v4 key mapping for Dashboard.jsx stability.
 * - Logic Integrity: Secured identity resolution for ledger synchronization.
 * - Compliance: Refined whale-shield advisory status for the IPO phase.
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
             * Resolves the Pioneer's UID or Address for real-time ledger sync.
             * This layer is fully compatible with the AuthMiddleware requirements.
             */
            const piAddress = req.user?.uid || req.user?.username; 

            /**
             * STEP 1: GLOBAL LIQUIDITY AGGREGATION
             * Calculating the 'Water-Level' across the entire ecosystem.
             * Essential for Philip's aggregate-based scarcity pricing.
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

            const totalPiInvested = globalMetrics[0]?.totalPi || 0;
            const totalInvestors = globalMetrics[0]?.investorCount || 0;

            /**
             * STEP 2: INDIVIDUAL LEDGER SYNC
             * Fetching personalized contribution data for the authenticated Pioneer.
             */
            const pioneer = await Investor.findOne({ piAddress });
            const userPiBalance = pioneer ? pioneer.totalPiContributed : 0;

            /**
             * STEP 3: DYNAMIC SPOT PRICE (Philip's Scarcity Formula)
             * Formula: Total MAPCAP IPO Supply (2,181,818) / Current Pool Liquidity.
             * Populates the "Value 2" scarcity metric in the Pioneer UI.
             */
            const IPO_MAPCAP_SUPPLY = 2181818;
            const spotPrice = totalPiInvested > 0 
                ? (IPO_MAPCAP_SUPPLY / totalPiInvested) 
                : 0; 

            /**
             * STEP 4: ALPHA GAIN & COMPLIANCE MONITORING
             * Calculates capital gains and monitors the 10% Whale ceiling.
             * Advisory status provided until final 28-day settlement cycle.
             */
            const userCapitalGain = MathHelper.calculateAlphaGain(userPiBalance);
            const userSharePct = MathHelper.getPercentage(userPiBalance, totalPiInvested);
            
            // isWhale remains advisory to maintain UX fluidity during the IPO stage
            const isWhale = userSharePct > 10.0;

            /**
             * STEP 5: STANDARDIZED SUCCESS RESPONSE
             * KEY: 'v1' through 'v4' keys are strictly preserved for Frontend parity.
             * This ensures zero disruption for Dashboard.jsx data binding.
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
                    // Status confirms enforcement is pending final settlement closure
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
             * Ensures system anomalies are captured for Daniel's audit review.
             */
            console.error(`[CRITICAL_CONTROLLER_ERROR]: ${error.message}`);
            return ResponseHelper.error(res, "Dashboard Sync Failed: Financial Pipeline Offline", 500);
        }
    }
}

export default IpoController;
