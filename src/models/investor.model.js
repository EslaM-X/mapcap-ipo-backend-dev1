/**
 * Investor Schema - Core Financial Equity Ledger v1.7.4
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Dynamic IPO Liquidity & Whale-Shield
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * This model serves as the 'Single Source of Truth' for all Pioneer stakes.
 * It is engineered to handle high-frequency IPO contributions while 
 * maintaining strict financial integrity and dynamic share calculation.
 * -------------------------------------------------------------------------
 */

import mongoose from 'mongoose';

const InvestorSchema = new mongoose.Schema({
    // Unique Pi Network Wallet Identifier used for cross-referencing SDK payments
    piAddress: { 
        type: String, 
        required: [true, 'Pi Address is required for ledger synchronization'], 
        unique: true, 
        index: true, 
        trim: true 
    },
    
    // Aggregated Pi contribution throughout the 4-week IPO cycle
    // CRITICAL: Used by AdminController aggregate and SettlementJob trim-back
    totalPiContributed: { 
        type: Number, 
        default: 0, 
        min: [0, 'Contribution cannot be negative'] 
    },
    
    // Total MapCap assets calculated at the time of each transaction
    allocatedMapCap: { 
        type: Number, 
        default: 0, 
        min: 0 
    },
    
    // Cumulative assets already distributed to the Pioneer's wallet
    mapCapReleased: { 
        type: Number, 
        default: 0 
    },
    
    // Progress tracker for the 10-month post-IPO vesting schedule
    vestingMonthsCompleted: { 
        type: Number, 
        default: 0, 
        min: 0, 
        max: 10 
    },
    
    // Advisory flag: Indicates if current stake exceeds the 10% decentralization ceiling.
    // Logic: Triggered by SettlementJob.executeWhaleTrimBack()
    isWhale: { 
        type: Boolean, 
        default: false 
    },
    
    // Audit timestamp for the most recent activity (Settlement or Contribution)
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
 * -------------------------------------------------------------------------
 * Ensures that released assets never exceed total allocation.
 */
InvestorSchema.pre('save', function(next) {
    if (this.mapCapReleased > this.allocatedMapCap) {
        this.mapCapReleased = this.allocatedMapCap;
    }
    next();
});

/**
 * VIRTUAL: sharePct (Dynamic Scarcity Calculation)
 * -------------------------------------------------------------------------
 * Logic: Calculates proportional share against the fixed supply (2,181,818). 
 */
InvestorSchema.virtual('sharePct').get(function() {
    const GLOBAL_SUPPLY = 2181818; 
    if (!this.allocatedMapCap || this.allocatedMapCap === 0) return 0;
    return (this.allocatedMapCap / GLOBAL_SUPPLY) * 100;
});

/**
 * VIRTUAL: remainingVesting
 * -------------------------------------------------------------------------
 * Calculates the locked equity balance for UI display.
 */
InvestorSchema.virtual('remainingVesting').get(function() {
    return Math.max(0, this.allocatedMapCap - this.mapCapReleased);
});

// INDEXING STRATEGY: Optimized for high-speed leaderboard and Whale-Shield audit queries
InvestorSchema.index({ totalPiContributed: -1, isWhale: 1 });

const Investor = mongoose.model('Investor', InvestorSchema);

export default Investor;
