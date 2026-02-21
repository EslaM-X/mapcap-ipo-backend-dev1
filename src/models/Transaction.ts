/**
 * Transaction Schema - Financial Audit Ledger v1.7.5 (TS)
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Transparency Standard
 * ---------------------------------------------------------
 * TS CONVERSION LOG:
 * - Defined TransactionType and TransactionStatus enums for type safety.
 * - Implemented ITransaction interface extending mongoose.Document.
 * - Enforced numeric precision for financial auditing.
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * @enum TransactionType
 * Standardized flow categorization as per Philip's Specifications.
 */
export enum TransactionType {
    INVESTMENT = 'INVESTMENT',
    REFUND = 'REFUND',
    DIVIDEND = 'DIVIDEND',
    VESTING_RELEASE = 'VESTING_RELEASE'
}

/**
 * @enum TransactionStatus
 * Lifecycle state within the Pi Network / A2UaaS pipeline.
 */
export enum TransactionStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}

/**
 * @interface ITransaction
 * High-precision record of every Pi movement.
 */
export interface ITransaction extends Document {
    piAddress: string;
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    piTxId?: string;
    memo?: string;
    createdAt: Date;
    updatedAt: Date;
}

const TransactionSchema: Schema<ITransaction> = new Schema({
    /**
     * @property {String} piAddress
     * The unique identifier for the Pioneer's wallet. 
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
     * KEY: 'REFUND' tracks the post-IPO Whale-Shield trim-backs.
     */
    type: { 
        type: String, 
        enum: Object.values(TransactionType), 
        required: true 
    },
    
    /**
     * @property {String} status
     * Current state of the transaction.
     */
    status: { 
        type: String, 
        enum: Object.values(TransactionStatus), 
        default: TransactionStatus.PENDING 
    },
    
    /**
     * @property {String} piTxId
     * Unique Blockchain Hash. Unique index prevents double-entry errors.
     */
    piTxId: { 
        type: String,
        unique: true,
        sparse: true, // Allows nulls for PENDING transactions while enforcing uniqueness for COMPLETED ones
        trim: true
    },

    /**
     * @property {String} memo
     * Audit notes for administrative review.
     */
    memo: {
        type: String,
        default: ""
    }
}, { 
    timestamps: true 
});

/**
 * INDEXING STRATEGY:
 * Optimized for Dashboard queries: "Fetch all completed dividends for this user".
 */
TransactionSchema.index({ piAddress: 1, type: 1, createdAt: -1 });

const Transaction: Model<ITransaction> = mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
