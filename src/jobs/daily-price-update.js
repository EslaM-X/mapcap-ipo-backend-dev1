/**
 * Daily Price Update Job
 * ---------------------------------------------------------
 * This job runs automatically once every 24 hours (Midnight UTC).
 * It updates the 'Spot Price' based on the current total Pi in the pool.
 * This ensures the "IPO Pulse Dashboard" reflects real-time data.
 */

const PriceService = require('../services/price.service');
const Investor = require('../models/Investor'); // To get the total pool size

class DailyPriceJob {
    /**
     * Executes the daily price calculation and logging.
     */
    static async updatePrice() {
        console.log("--- [SYSTEM] Starting Daily Price Update ---");

        try {
            // 1. Fetch all investments to calculate the total pool size
            const result = await Investor.aggregate([
                { $group: { _id: null, totalPool: { $sum: "$totalPiContributed" } } }
            ]);

            const totalPiInvested = result.length > 0 ? result[0].totalPool : 0;

            // 2. Calculate new spot price using Philip's Water-level formula
            const newPrice = PriceService.calculateDailySpotPrice(totalPiInvested);
            const formattedPrice = PriceService.formatPrice(newPrice);

            console.log(`[LOG] Total Pool: ${totalPiInvested} Pi`);
            console.log(`[LOG] New Spot Price: ${formattedPrice} Pi per MapCap`);

            /**
             * 3. (Optional) Here you can save this price to a 'DailyStats' collection 
             * to show a price history graph on the Frontend.
             */
            
            console.log("--- [SUCCESS] Daily Price Update Completed ---");
            return { totalPiInvested, newPrice: formattedPrice };

        } catch (error) {
            console.error("--- [ERROR] Failed to update daily price:", error.message);
        }
    }
}

module.exports = DailyPriceJob;
