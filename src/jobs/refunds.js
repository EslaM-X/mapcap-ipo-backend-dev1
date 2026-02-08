/**
 * Whale Refund Job - Anti-Whale Enforcement
 * ---------------------------------------------------------
 * This script is executed manually or via a scheduled task at the end of the IPO.
 * It enforces the 10% Whale Cap rule by calculating the excess Pi 
 * and returning it to the investors via the A2UaaS protocol.
 */

const PaymentService = require('../services/payment.service'); // Unified Payment Service

/**
 * Runs the Whale Refund logic.
 * Follows Philip's instruction: (Payer, Payee, Amount) structure.
 * * @param {number} totalPiPool - The final total of Pi collected in the IPO.
 * @param {Array} investors - List of all investors and their contribution amounts.
 */
const runWhaleRefunds = async (totalPiPool, investors) => {
    // Define the 10% Whale Cap based on the final pool size
    const WHALE_CAP = totalPiPool * 0.10; 

    console.log(`--- Starting Whale Refund Process | Cap Limit: ${WHALE_CAP} Pi ---`);

    for (let investor of investors) {
        // Check if investor exceeds the 10% threshold
        if (investor.amountPi > WHALE_CAP) {
            const excessAmount = investor.amountPi - WHALE_CAP;
            
            console.log(`[REFUND] Processing whale: ${investor.piAddress} | Excess: ${excessAmount} Pi`);
            
            try {
                /**
                 * Executing the refund using the unified A2UaaS service.
                 * Parameters: (Payee, Amount) - Payer is handled internally by the service.
                 */
                await PaymentService.transferPi(investor.piAddress, excessAmount);
                console.log(`[SUCCESS] Refunded ${excessAmount} Pi to ${investor.piAddress}`);
            } catch (error) {
                console.error(`[ERROR] Failed to refund ${investor.piAddress}:`, error.message);
                // Log failed transactions for Daniel's audit trail
            }
        }
    }
    
    console.log("--- Whale Refund Process Completed Successfully ---");
};

module.exports = { runWhaleRefunds };
