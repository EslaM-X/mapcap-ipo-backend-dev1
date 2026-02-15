/**
 * Transaction Schema - Financial Audit Ledger v1.4.6
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Transparency Standard
 * ---------------------------------------------------------
 * PURPOSE:
 * Provides an immutable, high-precision record of every Pi movement.
 * Essential for the 'Pulse Dashboard' history and A2UaaS reconciliation.
 * ---------------------------------------------------------
 */

import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
    /**
     * @property {String} piAddress
     * The unique identifier for the Pioneer's wallet. 
     * Indexed for rapid audit trail retrieval.
     */
    piAddress: { 
        type: String, 
        required: [true, 'Transaction must be linked to a Pi Address'],
        index: true,
        trim: true
    },
    
    /**
     * @property {Number} amount
     * Volume of Pi involved. Supports 6-decimal precision (Pi Standard).
     */
    amount: { 
        type: Number, 
        required: [true, 'Transaction amount is required'],
        min: [0, 'Transaction amount cannot be negative']
    },
    
    /**
     * @property {String} type
     * Standardized flow categorization as per Philip's Specifications.
     * KEY: 'REFUND' tracks the post-IPO Whale-Shield trim-backs.
     */
    type: { 
        type: String, 
        enum: [
            'INVESTMENT',      // Inbound from Pioneer
            'REFUND',          // Outbound Whale-Shield adjustment (10% Cap)
            'DIVIDEND',        // Global Profit Sharing
            'VESTING_RELEASE'  // Monthly 10% Tranche release
        ], 
        required: true 
    },
    
    /**
     * @property {String} status
     * Lifecycle state within the Pi Network / A2UaaS pipeline.
     */
    status: { 
        type: String, 
        enum: ['PENDING', 'COMPLETED', 'FAILED'], 
        default: 'PENDING' 
    },
    
    /**
     * @property {String} piTxId
     * The official Blockchain Hash. Unique to prevent double-counting.
     */
    piTxId: { 
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },

    /**
     * @property {String} memo
     * Audit notes (e.g., "Whale-Shield 10% Cap Adjustment").
     */
    memo: {
        type: String,
        default: ""
    }
}, { 
    /**
     * Timestamps ensure Daniel has an exact 'Date/Time' for every 
     * financial event in the system audit logs.
     */
    timestamps: true 
});

/**
 * INDEXING STRATEGY:
 * Optimized for Dashboard queries: "Fetch all completed dividends for this user".
 */
TransactionSchema.index({ piAddress: 1, type: 1, createdAt: -1 });

// Compatibility Fix: Exporting as ES Module
const Transaction = mongoose.model('Transaction', TransactionSchema);
export default Transaction;
