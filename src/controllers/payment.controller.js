/**
 * Payment Controller - Financial Operations
 * ---------------------------------------------------------
 * This controller handles incoming investment payments and 
 * verifies Pi Network transactions.
 */

const Investor = require('../models/Investor');
const Transaction = require('../models/Transaction');
const PaymentService = require('../services/payment.service');

class PaymentController {
    /**
     * Handle New Investment
     * This is called after the user completes the Pi payment in the frontend.
     */
    static async processInvestment(req, res) {
        const { piAddress, amount, piTxId } = req.body;

        try {
            // 1. Record the transaction in the Audit Log
            const newTransaction = await Transaction.create({
                piAddress,
                amount,
                type: 'INVESTMENT',
                status: 'COMPLETED',
                piTxId
            });

            // 2. Update or Create the Investor record
            let investor = await Investor.findOne({ piAddress });

            if (investor) {
                investor.totalPiContributed += amount;
                investor.lastContributionDate = Date.now();
            } else {
                investor = new Investor({
                    piAddress,
                    totalPiContributed: amount
                });
            }

            // 3. Save investor data and recalculate share (Logic handled in background jobs)
            await investor.save();

            res.status(200).json({
                success: true,
                message: "Investment processed successfully",
                transaction: newTransaction
            });

        } catch (error) {
            console.error("Payment Processing Error:", error.message);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
}

module.exports = PaymentController;
