/**
 * Transaction Schema - Financial Audit Log v1.4
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Transparency Standard
 * * PURPOSE:
 * Immutable audit trail for all Pi/MapCap movements. 
 * Supports high-precision tracking for A2UaaS synchronization.
 * ---------------------------------------------------------
 */

import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
    /**
     * @property {String} piAddress
     * The Pioneer's wallet address. Indexed for high-speed audit reporting.
     */
    piAddress: { 
        type: String, 
        required: [true, 'Transaction must be linked to a Pi Address'],
        index: true,
        trim: true
    },
    
    /**
     * @property {Number} amount
     * Amount of Pi/MapCap involved. Uses Number for 6-decimal precision.
     */
    amount: { 
        type: Number, 
        required: [true, 'Transaction amount is required'],
        min: [0, 'Amount cannot be negative']
    },
    
    /**
     * @property {String} type
     * Lifecycle categorization as per Spec Page 5-6.
     */
    type: { 
        type: String, 
        enum: [
            'INVESTMENT',     // Initial contribution from user
            'REFUND',         // Anti-Whale 10% trim-back (Automatic)
            'DIVIDEND',       // Global profit sharing from Map of Pi
            'VESTING_RELEASE' // Monthly 10% MapCap tranche release
        ], 
        required: true 
    },
    
    /**
     * @property {String} status
     * Real-time sync status with the Pi Blockchain.
     */
    status: { 
        type: String, 
        enum: ['PENDING', 'COMPLETED', 'FAILED'], 
        default: 'PENDING' // Changed to PENDING to reflect async A2UaaS nature
    },
    
    /**
     * @property {String} piTxId
     * Official Pi Network Blockchain Hash. 
     * Unique to prevent double-counting of a single transaction.
     */
    piTxId: { 
        type: String,
        unique: true,
        sparse: true, 
        trim: true,
        index: true
    },

    /**
     * @property {String} memo
     * Audit notes (e.g., "Tranche 4/10", "Whale Refund for 10% cap").
     */
    memo: {
        type: String,
        default: ""
    }
}, { 
    /**
     * Timestamps provide 'createdAt' (Transaction Execution Time) 
     * and 'updatedAt' for audit compliance.
     */
    timestamps: true 
});

/**
 * INDEXING STRATEGY:
 * Optimized for Daniel's Dashboard: "Show all REFUNDS for this user".
 */
TransactionSchema.index({ piAddress: 1, type: 1, createdAt: -1 });



const Transaction = mongoose.model('Transaction', TransactionSchema);

export default Transaction;
