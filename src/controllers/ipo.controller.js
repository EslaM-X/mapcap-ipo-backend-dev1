/**
 * IpoController - MapCap IPO Pulse Dashboard Controller
 * -------------------------------------------------------------------------
 * [span_2](start_span)This controller serves the "Single Screen" layout requirements[span_2](end_span).
 * It provides the four specific values defined by Philip Jennings to ensure 
 * [span_3](start_span)[span_4](start_span)pioneers see their 20% capital increase clearly[span_3](end_span)[span_4](end_span).
 */

const Investor = require('../models/Investor');
const MapCapTokenomics = require('../config/initial_mint'); [span_5](start_span)// For IPO_POOL (2,181,818)[span_5](end_span)

class IpoController {
    /**
     * Get Screen Stats
     * ----------------
     * [span_6](start_span)Fetches the data required for the middle section of the app[span_6](end_span).
     * Returns the 4 essential values for the pioneer dashboard.
     */
    static async getScreenStats(req, res) {
        try {
            [span_7](start_span)// Retrieve piAddress from authenticated user context[span_7](end_span)
            const { piAddress } = req.user; 

            // 1. Calculate Global Statistics using MongoDB Aggregation
            const globalAggregation = await Investor.aggregate([
                { 
                    $group: { 
                        _id: null, 
                        totalPi: { $sum: "$totalPiContributed" }, 
                        uniqueInvestors: { $sum: 1 } 
                    } 
                }
            ]);

            const totalPiInvested = globalAggregation.length > 0 ? globalAggregation[0].totalPi : 0;
            const totalInvestors = globalAggregation.length > 0 ? globalAggregation[0].uniqueInvestors : 0;

            // 2. Retrieve the current user's specific investment balance
            const user = await Investor.findOne({ piAddress });
            const userPiBalance = user ? user.totalPiContributed : 0;

            /**
             * 3. Calculate "User's capital gain to date" (Value 4)
             * [span_8](start_span)Per Philip's requirement: "This value will be 20% greater than value 3"[span_8](end_span).
             */
            const userCapitalGain = userPiBalance * 1.20;

            /**
             * 4. [span_9](start_span)Calculate current Spot-Price for the graph[span_9](end_span)
             * [span_10](start_span)Formula: IPO MapCap (2,181,818) / Total Pi Pool balance[span_10](end_span).
             */
            const currentSpotPrice = totalPiInvested > 0 
                ? (MapCapTokenomics.IPO_POOL / totalPiInvested) 
                : 0;

            [span_11](start_span)// Prepare the professional response aligned with Use Case Section 3[span_11](end_span)
            res.status(200).json({
                success: true,
                data: {
                    [span_12](start_span)totalInvestors,          // Value 1: Unique IPO pioneers[span_12](end_span)
                    [span_13](start_span)totalPiInvested,         // Value 2: Total amount of pi by all[span_13](end_span)
                    [span_14](start_span)userPiInvested: userPiBalance, // Value 3: Current user's balance[span_14](end_span)
                    [span_15](start_span)[span_16](start_span)userCapitalGain,         // Value 4: 20% Capital increase[span_15](end_span)[span_16](end_span)
                    [span_17](start_span)[span_18](start_span)currentSpotPrice,        // Used for the price graph[span_17](end_span)[span_18](end_span)
                    status: totalPiInvested === 0 ? [span_19](start_span)"Calculating..." : "Active" //[span_19](end_span)
                }
            });

        } catch (error) {
            console.error("[IPO CONTROLLER ERROR]:", error.message);
            res.status(500).json({ 
                success: false, 
                message: "Error loading IPO pulse data.",
                error: error.message 
            });
        }
    }
}

module.exports = IpoController;
