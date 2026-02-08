/**
 * Transaction Model - Audit Log for Pi Payments
 * Records every A2UaaS movement (Investments, Refunds, Dividends).
 * Essential for the 4-week audit trail.
 */
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    piAddress: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { 
        type: String, 
        enum: ['INVESTMENT', 'REFUND', 'DIVIDEND'], 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['PENDING', 'COMPLETED', 'FAILED'], 
        default: 'COMPLETED' 
    },
    txId: { type: String } // Pi Network Transaction ID
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);

