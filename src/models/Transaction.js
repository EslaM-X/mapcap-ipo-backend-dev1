/**
 * Transaction Schema - Financial Audit Log
 * ---------------------------------------------------------
 * Records every Pi movement (Investments, Whale Refunds, and Dividends).
 * This ensures transparency as requested by Daniel and Philip.
 */
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    // Wallet address involved in the transaction
    piAddress: { 
        type: String, 
        required: true,
        index: true 
    },
    
    // Amount of Pi moved in this specific transaction
    amount: { 
        type: Number, 
        required: true 
    },
    
    // Type of transaction based on Philip's standardized flows
    type: { 
        type: String, 
        enum: ['INVESTMENT', 'REFUND', 'DIVIDEND'], 
        required: true 
    },
    
    // Status of the transaction via Pi Network API
    status: { 
        type: String, 
        enum: ['PENDING', 'COMPLETED', 'FAILED'], 
        default: 'COMPLETED' 
    },
    
    // The official Transaction ID returned from Pi Network
    piTxId: { 
        type: String,
        unique: true,
        sparse: true 
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Transaction', TransactionSchema);
