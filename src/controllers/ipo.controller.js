/**
 * MapCap IPO Controller - Financial Engine v1.4 (Spec-Compliant)
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel
 */

import Investor from '../models/investor.model.js';
import MathHelper from '../utils/math.helper.js';
import ResponseHelper from '../utils/response.helper.js';

class IpoController {
    static async getScreenStats(req, res) {
        try {
            // Username injected by auth middleware (Daniel's Security Standard)
            const { username } = req.user; 

            // 1. GLOBAL AGGREGATION (Requirement 73-74)
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

            // 2. INDIVIDUAL LEDGER SYNC (Requirement 75)
            const pioneer = await Investor.findOne({ username });
            const userPiBalance = pioneer ? pioneer.totalPiContributed : 0;

            /**
             * 3. OFFICIAL SPOT PRICE FORMULA (Page 4 Spec)
             * Formula: IPO MapCap (2,181,818) / Total Pi in Wallet
             */
            const IPO_MAPCAP_SUPPLY = 2181818;
            const spotPrice = totalPiInvested > 0 
                ? (IPO_MAPCAP_SUPPLY / totalPiInvested) 
                : 0; // Returns 0 to trigger "Calculating..." in PriceGraph.jsx

            /**
             * 4. VALUE 4: ALPHA GAIN (20% Uplift)
             * As per Page 4: "Pioneers pay 20% below LP value"
             */
            const userCapitalGain = userPiBalance * 1.20;

            /**
             * 5. ANTI-WHALE COMPLIANCE (Daniel's Protocol)
             * Flagging if user exceeds 10% of total pool for refund auditing.
             */
            const isWhale = totalPiInvested > 0 && (userPiBalance / totalPiInvested) > 0.10;

            // Mocking daily prices for the last 28 days (Requirement 63)
            // In production, this pulls from a 'DailySnapshots' collection.
            const dailyPrices = pioneer?.priceHistory || [];

            return ResponseHelper.success(res, "Sync Complete", {
                totalInvestors,            // Value 1
                totalPiInvested,           // Value 2
                userPiInvested: userPiBalance, // Value 3
                userCapitalGain,           // Value 4
                spotPrice: MathHelper.toPiPrecision(spotPrice),
                dailyPrices,               
                isWhale,                   // Trigger for StatsPanel.jsx warning
                daysRemaining: 28 - (pioneer?.daysActive || 0)
            });

        } catch (error) {
            console.error(`[AUDIT_LOG]: Calculation Failure - ${error.message}`);
            return ResponseHelper.error(res, "Ledger Sync Error", 500);
        }
    }
}

export default IpoController;
