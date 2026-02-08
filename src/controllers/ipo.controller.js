/**
 * IPO Controller - The Brain of API Endpoints
 * ---------------------------------------------------------
 * This controller orchestrates the flow between the Routes, 
 * Models, and Services for the MapCap IPO Dashboard.
 */

const Investor = require('../models/Investor');
const PriceService = require('../services/price.service');
const brandingConfig = require('../config/branding.config');

class IpoController {
    /**
     * Get Dashboard Stats
     * Returns: Total Pi, Current Spot Price, and Progress towards the 4-week goal.
     */
    static async getDashboardStats(req, res) {
        try {
            // 1. Calculate Total Pi Collected using MongoDB Aggregation
            const aggregation = await Investor.aggregate([
                { $group: { _id: null, total: { $sum: "$totalPiContributed" } } }
            ]);
            
            const totalPiCollected = aggregation.length > 0 ? aggregation[0].total : 0;

            // 2. Calculate Spot Price using the "Water-Level" logic
            const currentPrice = PriceService.calculateDailySpotPrice(totalPiCollected);
            const formattedPrice = PriceService.formatPrice(currentPrice);

            // 3. Prepare the response with Branding & Data
            res.status(200).json({
                success: true,
                project: brandingConfig.projectName,
                stats: {
                    totalPi: totalPiCollected,
                    spotPrice: formattedPrice,
                    currency: brandingConfig.currencySymbol,
                    investorCount: await Investor.countDocuments(),
                    progressPercentage: (totalPiCollected / (brandingConfig.totalIpoAmount * 10)) * 100 // Example logic
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: "Error fetching IPO stats", error: error.message });
        }
    }

    /**
     * Get Top Investors (Whale Watch)
     * Helps users see the current 10% cap leaders.
     */
    static async getTopInvestors(req, res) {
        try {
            const topInvestors = await Investor.find()
                .sort({ totalPiContributed: -1 })
                .limit(10);
                
            res.status(200).json({ success: true, data: topInvestors });
        } catch (error) {
            res.status(500).json({ success: false, message: "Error fetching top investors" });
        }
    }
}

module.exports = IpoController;

