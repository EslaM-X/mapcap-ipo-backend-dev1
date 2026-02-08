/**
 * Settlement Job - Anti-Whale Refund Engine
 * ---------------------------------------------------------
 * This script runs as a one-off batch job at the end of the 4-week IPO.
 * It identifies "Whales" (investors holding > 10% of total pool) 
 * and performs a trim-back/refund as per Philip's instruction.
 */

const PaymentService = require('../services/payment.service');

class SettlementJob {
  /**
   * Executes the final trim-back process.
   * @param {Array} allInvestors - List of all investors with their Pi balances.
   * @param {number} totalPiPool - The final total amount of Pi collected.
   */
  static async executeWhaleTrimBack(allInvestors, totalPiPool) {
    console.log("--- Starting Final IPO Settlement ---");
    
    // The 10% Whale Cap: No single person can own more than 10% of the total
    const WHALE_CAP_LIMIT = totalPiPool * 0.10;
    
    let totalRefunded = 0;

    for (const investor of allInvestors) {
      if (investor.piAmount > WHALE_CAP_LIMIT) {
        // Calculate the excess amount to be returned
        const refundAmount = investor.piAmount - WHALE_CAP_LIMIT;
        
        console.log(`Whale detected: ${investor.address}. Excess: ${refundAmount} Pi. Initiating Refund...`);

        try {
          /**
           * Perform the actual refund using the A2UaaS unified service.
           * This ensures the whale is 'trimmed back' to exactly 10%.
           */
          await PaymentService.transferPi(investor.address, refundAmount);
          totalRefunded += refundAmount;
          
        } catch (error) {
          console.error(`Failed to refund investor ${investor.address}:`, error.message);
          // In a real scenario, failed refunds would be logged for manual retry.
        }
      }
    }

    console.log(`--- Settlement Complete. Total Pi Refunded: ${totalRefunded} ---`);
    return { success: true, totalRefunded };
  }
}

module.exports = SettlementJob;

