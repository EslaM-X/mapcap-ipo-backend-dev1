/**
 * SettlementJob - Anti-Whale Refund Engine
 * ---------------------------------------------------------
 * This job executes at the conclusion of the 4-week IPO cycle.
 * It strictly enforces Philip's "10% Cap" rule by refunding 
 * any excess Pi to "Whale" investors via the A2UaaS protocol.
 * * @category Job / Settlement
 */

const PaymentService = require('../services/payment.service');

class SettlementJob {
  /**
   * Executes the final trim-back process for all investors.
   * * @param {Array} allInvestors - Array of Investor documents from MongoDB.
   * @param {number} totalPiPool - The absolute final total of Pi collected in the IPO.
   * @returns {Promise<object>} Summary of the settlement execution.
   */
  static async executeWhaleTrimBack(allInvestors, totalPiPool) {
    console.log("--- [SYSTEM] Starting Final IPO Settlement ---");
    
    /**
     * Whale Cap Calculation:
     * No single investor can hold more than 10% of the final pool.
     */
    const WHALE_CAP_LIMIT = totalPiPool * 0.10;
    let totalRefunded = 0;
    let whaleCount = 0;

    for (const investor of allInvestors) {
      // Using 'totalPiContributed' to match our Investor Model
      if (investor.totalPiContributed > WHALE_CAP_LIMIT) {
        whaleCount++;
        
        // Calculate the exact excess to be refunded to comply with the 10% rule
        const refundAmount = investor.totalPiContributed - WHALE_CAP_LIMIT;
        
        console.log(`[WHALE DETECTED] Wallet: ${investor.piAddress} | Excess: ${refundAmount} Pi`);

        try {
          /**
           * Execute the Refund via A2UaaS.
           * This uses the core PaymentService for consistency.
           */
          await PaymentService.transferPi(investor.piAddress, refundAmount);
          
          totalRefunded += refundAmount;
          console.log(`[SUCCESS] Refunded ${refundAmount} Pi to ${investor.piAddress}`);
          
        } catch (error) {
          // Log failure for manual audit as per Daniel's transparency requirement
          console.error(`[CRITICAL] Refund failed for ${investor.piAddress}:`, error.message);
        }
      }
    }

    console.log(`--- [SUMMARY] Settlement Complete ---`);
    console.log(`Whales Processed: ${whaleCount}`);
    console.log(`Total Pi Refunded: ${totalRefunded}`);
    
    return { 
      success: true, 
      whalesImpacted: whaleCount, 
      totalRefunded: totalRefunded 
    };
  }
}

module.exports = SettlementJob;

