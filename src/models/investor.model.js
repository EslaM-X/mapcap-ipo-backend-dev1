/**
 * Investor Schema - Core Financial Equity Ledger v1.7.1 (Automated & Stabilized)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel Compliance
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Serves as the decentralized ledger for IPO participants. Features automated 
 * Whale-Shield logic and negative-balance protection. 
 * This model is the 'Source of Truth' for all Pioneer equity and vesting status.
 * -------------------------------------------------------------------------
 */

import mongoose from 'mongoose';

const InvestorSchema = new mongoose.Schema({
    piAddress: { 
        type: String, 
        required: [true, 'Pi Wallet Address is mandatory'], 
        unique: true,
        index: true,
        trim: true
    },
    totalPiContributed: { 
        type: Number, 
        default: 0,
        min: [0, 'Contribution balance cannot be negative']
    },
    allocatedMapCap: {
        type: Number,
        default: 0,
        min: 0
    },
    mapCapReleased: {
        type: Number,
        default: 0
    },
    vestingMonthsCompleted: {
        type: Number,
        default: 0,
        min: 0,
        max: 10
    },
    isWhale: { 
        type: Boolean, 
        default: false 
    },
    lastContributionDate: { 
        type: Date, 
        default: Date.now 
    }
}, { 
    timestamps: true,
    // Ensure virtuals are included when sending data to the Frontend
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

/**
 * PRE-SAVE HOOK: Automated Whale-Shield & Integrity Logic
 * Intercepts the save process to enforce Philip's 10% ceiling logic.
 */
InvestorSchema.pre('save', function(next) {
    const GLOBAL_SUPPLY = 2181818;
    const WHALE_THRESHOLD = 0.10; // 10% Ceiling as per Philip's Spec

    // 1. Automated Anti-Whale Flagging:
    // Calculates the share based on fixed supply to monitor decentralization.
    const currentShare = this.allocatedMapCap / GLOBAL_SUPPLY;
    this.isWhale = currentShare >= WHALE_THRESHOLD;

    // 2. Over-Release Protection:
    // Ensures released tokens never exceed the total allocation (Math.max logic).
    if (this.mapCapReleased > this.allocatedMapCap) {
        this.mapCapReleased = this.allocatedMapCap;
    }

    next();
});

/**
 * VIRTUAL PROPERTY: remainingVesting
 * Dynamically calculates the locked balance for the Frontend Dashboard.
 */
InvestorSchema.virtual('remainingVesting').get(function() {
    return Math.max(0, this.allocatedMapCap - this.mapCapReleased);
});

/**
 * VIRTUAL PROPERTY: sharePct
 * Synchronized with the 2,181,818 Scarcity Supply for real-time UI updates.
 */
InvestorSchema.virtual('sharePct').get(function() {
    const GLOBAL_SUPPLY = 2181818;
    if (this.allocatedMapCap === 0) return 0;
    return (this.allocatedMapCap / GLOBAL_SUPPLY) * 100;
});

// INDEXING: Optimized for high-speed leaderboard and audit queries.
InvestorSchema.index({ totalPiContributed: -1, isWhale: 1 });

const Investor = mongoose.model('Investor', InvestorSchema);



export default Investor;
