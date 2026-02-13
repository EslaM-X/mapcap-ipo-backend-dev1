/**
 * Investor Schema - Core Financial Equity Ledger v1.7 (Automated & Stabilized)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel Compliance
 * * DESCRIPTION:
 * Decentralized ledger for IPO participants. Now features automated Whale-Shield 
 * logic and negative-balance protection via Math.max orchestration.
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

/**
 * PRE-SAVE HOOK: Automated Whale-Shield & Integrity Logic
 * This ensures the Backend is the "Single Source of Truth".
 */
InvestorSchema.pre('save', function(next) {
    const GLOBAL_SUPPLY = 2181818;
    const WHALE_THRESHOLD = 0.10; // 10% Ceiling as per Philip's Spec

    // 1. Automated Anti-Whale Flagging
    const currentShare = this.allocatedMapCap / GLOBAL_SUPPLY;
    this.isWhale = currentShare >= WHALE_THRESHOLD;

    // 2. Negative Balance Protection (Math.max(0, ...))
    // Ensures UI never displays negative equity during sync delays
    if (this.mapCapReleased > this.allocatedMapCap) {
        this.mapCapReleased = this.allocatedMapCap;
    }

    next();
});

/**
 * VIRTUAL PROPERTY: remainingVesting
 * Refined with Math.max to prevent negative display on Frontend.
 */
InvestorSchema.virtual('remainingVesting').get(function() {
    return Math.max(0, this.allocatedMapCap - this.mapCapReleased);
});

/**
 * VIRTUAL PROPERTY: sharePct
 * Synchronized with the 2,181,818 Scarcity Supply.
 */
InvestorSchema.virtual('sharePct').get(function() {
    const GLOBAL_SUPPLY = 2181818;
    return (this.allocatedMapCap / GLOBAL_SUPPLY) * 100;
});

InvestorSchema.index({ totalPiContributed: -1, isWhale: 1 });

const Investor = mongoose.model('Investor', InvestorSchema);

export default Investor;
