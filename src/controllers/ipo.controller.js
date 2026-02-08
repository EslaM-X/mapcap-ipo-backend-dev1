/**
 * IpoController - MapCap IPO Pulse Dashboard
 * ---------------------------------------------------------
 * This controller acts as the central hub for Philip's "Single Screen" layout.
 * It integrates MathHelper for precision calculations and ResponseHelper 
 * for standardized API delivery, ensuring Daniel's security and audit 
 * standards are maintained.
 */

const Investor = require('../models/Investor');
const MathHelper = require('../utils/math.helper');
const ResponseHelper = require('../utils/response.helper');
const MapCapTokenomics = require('../config/initial_mint');

class IpoController {
    /**
     * Get Screen Stats
     * Fetches the 4 essential IPO values with high mathematical precision.
     */
    static async getScreenStats(req, res) {
        try {
            // Retrieve piAddress from authenticated user context (Daniel's Security)
            const { piAddress } = req.user; 

            // 1. Calculate Global Statistics using optimized MongoDB Aggregation
            const globalAggregation = await Investor.aggregate([
                { 
                    $group: { 
                        _id: null, 
                        totalPi: { $sum: "$totalPiContributed" }, 
                        count: { $sum: 1 } 
                    } 
                }
            ]);

            const totalPiInvested = globalAggregation[0]?.totalPi || 0;
            const totalInvestors = globalAggregation[0]?.count || 0;

            // 2. Retrieve user-specific data
            const user = await Investor.findOne({ piAddress });
            const userPiBalance = user ? user.totalPiContributed : 0;

            /**
             * 3. Financial Precision Logic
             * Value 4: 20% Capital Increase (Calculated via MathHelper)
             * Spot Price: Derived from Philip's Water-Level formula
             */
            const userCapitalGain = MathHelper.calculateAlphaGain(userPiBalance);
            
            // Calculating current Spot Price per MapCap instructions
            const rawSpotPrice = totalPiInvested > 0 
                ? (MapCapTokenomics.IPO_POOL / totalPiInvested) 
                : 0;
            
            const spotPrice = MathHelper.toPiPrecision(rawSpotPrice);

            /**
             * 4. Standardized Response Integration
             * Delivering Value 1, 2, 3, and 4 in a unified JSON structure.
             */
            return ResponseHelper.success(res, "IPO Pulse Data Fetched Successfully", {
                totalInvestors,          // Value 1
                totalPiInvested,         // Value 2
                userPiInvested: userPiBalance, // Value 3
                userCapitalGain,         // Value 4
                spotPrice,               // Price Graph Data
                status: totalPiInvested === 0 ? "Initial Minting" : "Active"
            });

        } catch (error) {
            // Detailed logging for Daniel's audit.log
            console.error(`[IPO_CONTROLLER_CRITICAL]: ${error.message}`);
            return ResponseHelper.error(res, "Critical error loading IPO stats. System audit required.", 500);
        }
    }
}

module.exports = IpoController;
