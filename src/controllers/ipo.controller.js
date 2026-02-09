/**
 * MapCap IPO Controller - High-Precision Financial Engine v1.6
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel
 * * OPERATIONAL OVERVIEW:
 * Orchestrates the 'Single Screen' data delivery by calculating 
 * dynamic Spot Price and enforcing the 10% Anti-Whale ceiling.
 * ---------------------------------------------------------
 */

import Investor from '../models/investor.model.js';
import MathHelper from '../utils/math.helper.js';
import ResponseHelper from '../utils/response.helper.js';

class IpoController {
    /**
     * @method getScreenStats
     * @desc Syncs the dashboard with the Pi Network ledger and internal DB.
     * @returns {Object} Values 1-4 for the IPO Pulse UI.
     */
    static async getScreenStats(req, res) {
        try {
            /**
             * IDENTITY INJECTION:
             * Extracts the pioneer's wallet address from the authenticated request.
             */
            const username = req.user?.username || "test_pioneer_01"; 

            // 1. GLOBAL AGGREGATION: Total Liquidity & Scarcity Pool
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

            // 2. INDIVIDUAL LEDGER SYNC: Pioneer-specific stake calculation
            const pioneer = await Investor.findOne({ piAddress: username });
            const userPiBalance = pioneer ? pioneer.totalPiContributed : 0;

            /**
             * 3. OFFICIAL SPOT PRICE FORMULA (Page 4 Spec)
             * Formula: IPO MapCap Pool (2,181,818) / Current Total Contributed Pi.
             * High-precision rounding applied via MathHelper.
             */
            const IPO_MAPCAP_SUPPLY = 2181818;
            const spotPrice = totalPiInvested > 0 
                ? (IPO_MAPCAP_SUPPLY / totalPiInvested) 
                : 0; 

            /**
             * 4. VALUE 4: ALPHA GAIN (20% Early Access Reward)
             * Logic: 1.20x multiplier representing the delta between IPO and LP.
             */
            const userCapitalGain = userPiBalance * 1.20;

            /**
             * 5. WHALE-SHIELD COMPLIANCE:
             * Immediate detection if a single Pioneer holds > 10% of total pool.
             */
            const isWhale = totalPiInvested > 0 && (userPiBalance / totalPiInvested) > 0.10;

            

            // SUCCESS RESPONSE: Data Delivery for StatsPanel.jsx
            return ResponseHelper.success(res, "Financial Ledger Synchronized", {
                metrics: {
                    totalInvestors,            // Value 1
                    totalPiInvested,           // Value 2
                    userPiInvested: userPiBalance, // Value 3
                    userCapitalGain: MathHelper.toPiPrecision(userCapitalGain), // Value 4
                    spotPrice: MathHelper.toPiPrecision(spotPrice),
                },
                compliance: {
                    isWhale,
                    whaleCapLimit: 0.10,
                    status: isWhale ? "ACTION_REQUIRED" : "COMPLIANT"
                },
                timeline: {
                    daysActive: pioneer?.daysActive || 0,
                    daysRemaining: 28 - (pioneer?.daysActive || 0),
                    phase: "IPO_CYCLE_4_WEEKS"
                },
                priceHistory: pioneer?.priceHistory || []
            });

        } catch (error) {
            console.error(`[CRITICAL_AUDIT_FAILURE]: ${error.message}`);
            return ResponseHelper.error(res, "Ledger Sync Interrupted: Pipeline Failure", 500);
        }
    }
}

export default IpoController;
