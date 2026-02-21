/**
 * Investor Schema - Core Financial Equity Ledger v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Dynamic IPO Liquidity & Whale-Shield
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Implemented IInvestor interface to ensure type-safe financial operations.
 * - Maintained Virtuals for Frontend dashboard compatibility (sharePct, remainingVesting).
 * - Secured data integrity through pre-save lifecycle hooks.
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * @interface IInvestor
 * Single Source of Truth for Pioneer stakes and equity progress.
 */
export interface IInvestor extends Document {
    piAddress: string;
    totalPiContributed: number;
    allocatedMapCap: number;
    mapCapReleased: number;
    vestingMonthsCompleted: number;
    isWhale: boolean;
    lastContributionDate: Date;
    lastSettlementDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    // Virtuals
    sharePct: number;
    remainingVesting: number;
}

const InvestorSchema: Schema<IInvestor> = new Schema({
    /**
     * @property {String} piAddress
     * Unique Pi Network Wallet Identifier.
     */
    piAddress: { 
        type: String, 
        required: [true, 'Pi Address is required for ledger synchronization'], 
        unique: true, 
        index: true, 
        trim: true 
    },
    
    /**
     * @property {Number} totalPiContributed
     * Aggregated Pi contribution throughout the IPO cycle.
     */
    totalPiContributed: { 
        type: Number, 
        default: 0, 
        min: [0, 'Contribution cannot be negative'] 
    },
    
    /**
     * @property {Number} allocatedMapCap
     * Total MapCap assets allocated based on scarcity pricing.
     */
    allocatedMapCap: { 
        type: Number, 
        default: 0, 
        min: 0 
    },
    
    /**
     * @property {Number} mapCapReleased
     * Cumulative assets already dispatched to the Pioneer.
     */
    mapCapReleased: { 
        type: Number, 
        default: 0 
    },
    
    /**
     * @property {Number} vestingMonthsCompleted
     * Progress tracker for the 10-month linear release schedule.
     */
    vestingMonthsCompleted: { 
        type: Number, 
        default: 0, 
        min: 0, 
        max: 10 
    },
    
    /**
     * @property {Boolean} isWhale
     * Flag for accounts exceeding the 10% decentralization ceiling.
     */
    isWhale: { 
        type: Boolean, 
        default: false 
    },
    
    lastContributionDate: { 
        type: Date, 
        default: Date.now 
    },
    
    lastSettlementDate: {
        type: Date
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

/**
 * PRE-SAVE HOOK: Data Integrity & Overflow Protection
 */
InvestorSchema.pre<IInvestor>('save', function(next) {
    if (this.mapCapReleased > this.allocatedMapCap) {
        this.mapCapReleased = this.allocatedMapCap;
    }
    next();
});

/**
 * VIRTUAL: sharePct (Dynamic Scarcity Calculation)
 * Formula: (User Allocation / 2,181,818) * 100
 */
InvestorSchema.virtual('sharePct').get(function(this: IInvestor) {
    const GLOBAL_SUPPLY = 2181818; 
    if (!this.allocatedMapCap || this.allocatedMapCap === 0) return 0;
    return (this.allocatedMapCap / GLOBAL_SUPPLY) * 100;
});

/**
 * VIRTUAL: remainingVesting
 * Calculates locked equity for Dashboard UI display.
 */
InvestorSchema.virtual('remainingVesting').get(function(this: IInvestor) {
    return Math.max(0, this.allocatedMapCap - this.mapCapReleased);
});

// INDEXING STRATEGY: Optimized for leaderboard and Whale-Shield audits.
InvestorSchema.index({ totalPiContributed: -1, isWhale: 1 });

const Investor: Model<IInvestor> = mongoose.models.Investor || mongoose.model<IInvestor>('Investor', InvestorSchema);

export default Investor;
