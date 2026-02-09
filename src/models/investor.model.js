/**
 * Investor Schema - Core Financial Equity Ledger v1.6
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel
 * * DESCRIPTION:
 * Decentralized ledger for IPO participants. Enforces 10% Anti-Whale 
 * Ceiling and tracks the 10-month linear vesting schedule.
 * ---------------------------------------------------------
 */

import mongoose from 'mongoose';

const InvestorSchema = new mongoose.Schema({
    /**
     * @property {String} piAddress
     * Unique Pi Network wallet identifier. Indexed for O(1) lookups.
     */
    piAddress: { 
        type: String, 
        required: [true, 'Pi Wallet Address is mandatory'], 
        unique: true,
        index: true,
        trim: true
    },
    
    /**
     * @property {Number} totalPiContributed
     * Total Pi invested. Feeds "Value 3" on the Pulse Dashboard.
     */
    totalPiContributed: { 
        type: Number, 
        default: 0,
        min: [0, 'Balance cannot be negative']
    },

    /**
     * @property {Number} allocatedMapCap
     * Total equity based on Scarcity Spot Price. 
     * Target for the 10-month vesting release.
     */
    allocatedMapCap: {
        type: Number,
        default: 0,
        min: 0
    },
    
    /**
     * @property {Number} mapCapReleased
     * Tracks successfully transferred MapCap to prevent double-spending.
     */
    mapCapReleased: {
        type: Number,
        default: 0
    },

    /**
     * @property {Number} vestingMonthsCompleted
     * Tracks progress (0-10). Incremented by VestingJob monthly.
     */
    vestingMonthsCompleted: {
        type: Number,
        default: 0,
        min: 0,
        max: 10
    },
    
    /**
     * @property {Boolean} isWhale
     * Compliance Flag for the 10% Anti-Whale Ceiling.
     */
    isWhale: { 
        type: Boolean, 
        default: false 
    },
    
    /**
     * @property {Date} lastContributionDate
     * Audit timestamp for the last financial activity.
     */
    lastContributionDate: { 
        type: Date, 
        default: Date.now 
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

/**
 * VIRTUAL PROPERTY: remainingVesting
 * Dynamically calculates what is left to release without storing redundant data.
 */
InvestorSchema.virtual('remainingVesting').get(function() {
    return this.allocatedMapCap - this.mapCapReleased;
});

/**
 * VIRTUAL PROPERTY: sharePercentage
 * Logic: (Individual Allocation / Global Supply 2,181,818) * 100
 */
InvestorSchema.virtual('sharePct').get(function() {
    const GLOBAL_SUPPLY = 2181818;
    return (this.allocatedMapCap / GLOBAL_SUPPLY) * 100;
});

// Compound Index for optimized leaderboards and whale auditing
InvestorSchema.index({ totalPiContributed: -1, isWhale: 1 });

const Investor = mongoose.model('Investor', InvestorSchema);

export default Investor;
