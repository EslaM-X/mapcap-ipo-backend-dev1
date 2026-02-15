/**
 * Transaction Schema - Financial Audit Ledger v1.4.5
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Transparency Standard
 * ---------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Provides an immutable audit trail for all Pi/MapCap asset movements. 
 * Supports high-precision tracking for A2UaaS synchronization 
 * and post-IPO settlement reporting.
 * ---------------------------------------------------------
 */

import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
    /**
     * @property {String} piAddress
     * The Pioneer's wallet identifier. Indexed for ultra-fast 
     * audit reporting in the 'Pulse Dashboard'.
     */
    piAddress: { 
        type: String, 
        required: [true, 'Transaction must be linked to a Pi Address'],
        index: true,
        trim: true
    },
    
    /**
     * @property {Number} amount
     * Pi/MapCap volume. Supports up to 6 decimal places (Pi Standard).
     */
    amount: { 
        type: Number, 
        required: [true, 'Transaction amount is required'],
        min: [0, 'Amount cannot be negative']
    },
    
    /**
     * @property {String} type
     * Lifecycle categorization per Spec Page 5-6.
     * Essential for 'Whale-Shield' filtering and reporting.
     */
    type: { 
        type: String, 
        enum: [
            'INVESTMENT',     // Inbound contribution from Pioneer
            'REFUND',         // Dynamic 'Whale-Shield' trim-back (Post-IPO)
            'DIVIDEND',       // Global profit-sharing distribution
            'VESTING_RELEASE' // Scheduled 10% monthly MapCap tranche
        ], 
        required: true 
    },
    
    /**
     * @property {String} status
     * Current state within the A2UaaS (App-to-User) pipeline.
     */
    status: { 
        type: String, 
        enum: ['PENDING', 'COMPLETED', 'FAILED'], 
        default: 'PENDING' 
    },
    
    /**
     * @property {String} piTxId
     * Official Pi Network Blockchain Transaction Hash. 
     * Ensures uniqueness to prevent double-counting or replay attacks.
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
     * Audit narrative (e.g., "Whale-Shield 10% Trim-Back", "Vesting 1/10").
     * Appears in the Pioneer's personal transaction history.
     */
    memo: {
        type: String,
        default: ""
    }
}, { 
    /**
     * Automatic timestamps provide the audit-ready 'Date/Time' 
     * of every financial event.
     */
    timestamps: true 
});

/**
 * INDEXING STRATEGY:
 * Optimized for high-concurrency queries: "Filter by User + Transaction Type".
 */
TransactionSchema.index({ piAddress: 1, type: 1, createdAt: -1 });

const Transaction = mongoose.model('Transaction', TransactionSchema);

export default Transaction;
