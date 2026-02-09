/**
 * Admin Management Service
 * ---------------------------------------------------------
 * Handles internal data processing specifically for the Admin Dashboard.
 * Focuses on auditing, reporting, and high-level IPO oversight.
 */
const Investor = require('../../models/Investor');

class AdminService {
    /**
     * Generates an executive summary of the IPO performance.
     * Useful for the "IPO Pulse" overview.
     */
    static async getExecutiveSummary() {
        const stats = await Investor.aggregate([
            {
                $group: {
                    _id: null,
                    totalPi: { $sum: "$totalPiContributed" },
                    activeInvestors: { $sum: 1 }
                }
            }
        ]);

        return stats.length > 0 ? stats[0] : { totalPi: 0, activeInvestors: 0 };
    }
}

module.exports = AdminService;
