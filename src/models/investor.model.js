/**
 * Investor Schema - Core Financial Equity Ledger v1.6 (Production Ready)
 * -------------------------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel Compliance
 * * DESCRIPTION:
 * Decentralized ledger for IPO participants. Enforces the 10% Anti-Whale 
 * Ceiling and monitors the 10-month linear vesting schedule for MapCap equity.
 * -------------------------------------------------------------------------
 */

import mongoose from 'mongoose';

const InvestorSchema = new mongoose.Schema({
    /**
     * @property {String} piAddress
     * Unique Pi Network wallet identifier. Indexed for O(1) high-speed lookups.
     */
    piAddress: { 
        type: String, 
        required: [true, 'Pi Wallet Address is mandatory for A2UaaS synchronization'], 
        unique: true,
        index: true,
        trim: true
    },
    
    /**
     * @property {Number} totalPiContributed
     * Total Pi invested by the Pioneer. Feeds "Value 3" on the Pulse Dashboard.
     */
    totalPiContributed: { 
        type: Number, 
        default: 0,
        min: [0, 'Contribution balance cannot be negative']
    },

    /**
     * @property {Number} allocatedMapCap
     * Total equity based on Scarcity Spot Price (Total Pi / IPO Rate). 
     * This serves as the target for the 10-month vesting release.
     */
    allocatedMapCap: {
        type: Number,
        default: 0,
        min: 0
    },
    
    /**
     * @property {Number} mapCapReleased
     * Tracks successfully transferred MapCap tokens to prevent double-spending
     * during the automated monthly vesting cycles.
     */
    mapCapReleased: {
        type: Number,
        default: 0
    },

    /**
     * @property {Number} vestingMonthsCompleted
     * Tracks vesting progress (0-10). Incremented by the VestingJob monthly
     * until the 10-month linear distribution is finalized.
     */
    vestingMonthsCompleted: {
        type: Number,
        default: 0,
        min: 0,
        max: 10
    },
    
    /**
     * @property {Boolean} isWhale
     * Compliance Flag for Philip's 10% Anti-Whale Ceiling.
     * Automatically flagged if sharePercentage exceeds the decentralization limit.
     */
    isWhale: { 
        type: Boolean, 
        default: false 
    },
    
    /**
     * @property {Date} lastContributionDate
     * Audit timestamp for the last financial activity. Crucial for Daniel's audit trail.
     */
    lastContributionDate: { 
        type: Date, 
        default: Date.now 
    }
}, { 
    timestamps: true, // Manages createdAt and updatedAt for data integrity
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

/**
 * VIRTUAL PROPERTY: remainingVesting
 * Dynamically calculates the equity left to release without storing redundant data.
 * Formula: Total Allocation - Already Released Amount.
 */
InvestorSchema.virtual('remainingVesting').get(function() {
    return this.allocatedMapCap - this.mapCapReleased;
});

/**
 * VIRTUAL PROPERTY: sharePercentage
 * Logic: (Individual Allocation / Global Supply of 2,181,818) * 100
 * Essential for real-time Whale-Cap monitoring.
 */
InvestorSchema.virtual('sharePct').get(function() {
    const GLOBAL_SUPPLY = 2181818;
    return (this.allocatedMapCap / GLOBAL_SUPPLY) * 100;
});

/**
 * COMPOUND INDEX: 
 * Optimized for Leaderboards (Descending contribution) and Whale auditing.
 * Ensures the 'IPO Pulse' remains performant under high traffic.
 */
InvestorSchema.index({ totalPiContributed: -1, isWhale: 1 });

const Investor = mongoose.model('Investor', InvestorSchema);

export default Investor;
