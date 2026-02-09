/**
 * Transaction Schema - Financial Audit Log v1.3
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Transparency Standard
 * * PURPOSE:
 * Records every Pi movement (Investments, Whale Refunds, Dividends, Vesting).
 * Ensures an immutable audit trail for the 4-week IPO and beyond.
 * ---------------------------------------------------------
 */

import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
    // Wallet address of the Pioneer involved
    piAddress: { 
        type: String, 
        required: true,
        index: true,
        trim: true
    },
    
    // Amount of Pi moved (supports high precision for A2UaaS)
    amount: { 
        type: Number, 
        required: true 
    },
    
    // Enhanced Types to cover the full lifecycle [Spec Page 5-6]
    type: { 
        type: String, 
        enum: [
            'INVESTMENT',   // Initial contribution
            'REFUND',       // Anti-Whale 10% trim-back
            'DIVIDEND',     // Global revenue distribution
            'VESTING_RELEASE' // Monthly 10% MapCap release
        ], 
        required: true 
    },
    
    // Status tracking for real-time blockchain sync
    status: { 
        type: String, 
        enum: ['PENDING', 'COMPLETED', 'FAILED'], 
        default: 'COMPLETED' 
    },
    
    // The official Blockchain Transaction ID from Pi Network API
    piTxId: { 
        type: String,
        unique: true,
        sparse: true, // Allows nulls for pending/internal logs
        trim: true
    },

    // Optional: Reference to internal notes or reason
    memo: {
        type: String,
        default: ""
    }
}, { 
    timestamps: true // Captures 'createdAt' as the execution time
});

// Adding a compound index for fast audit lookups by user and type
TransactionSchema.index({ piAddress: 1, type: 1 });

const Transaction = mongoose.model('Transaction', TransactionSchema);
export default Transaction;
