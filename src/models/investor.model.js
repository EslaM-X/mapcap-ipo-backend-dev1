/**
 * Investor Schema - Core Financial Equity Tracker
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings
 * * PURPOSE: 
 * This model serves as the primary ledger for all IPO participants.
 * It enforces the 10% Anti-Whale Ceiling and tracks the 10-month 
 * linear vesting schedule as defined in the project specs.
 * ---------------------------------------------------------
 */

import mongoose from 'mongoose';

const InvestorSchema = new mongoose.Schema({
    /**
     * @property {String} piAddress
     * Unique Pi Network wallet identifier (Pioneer ID).
     * Indexed for high-performance lookups during peak IPO traffic.
     */
    piAddress: { 
        type: String, 
        required: [true, 'Pi Wallet Address is mandatory for ledger synchronization'], 
        unique: true,
        index: true,
        trim: true
    },
    
    /**
     * @property {Number} totalPiContributed
     * Cumulative amount of Pi contributed over the 4-week cycle.
     * Maps to "Value 3" in the real-time analytics dashboard.
     */
    totalPiContributed: { 
        type: Number, 
        default: 0,
        min: [0, 'Contribution cannot be negative']
    },

    /**
     * @property {Number} allocatedMapCap
     * Total MapCap tokens assigned based on the Daily Spot Price.
     * Subject to the 10-month vesting release (10% per month).
     */
    allocatedMapCap: {
        type: Number,
        default: 0,
        min: 0
    },
    
    /**
     * @property {Number} sharePercentage
     * Proportional equity ownership within the 2,181,818 MapCap Pool.
     * Formula: (allocatedMapCap / TOTAL_POOL) * 100.
     */
    sharePercentage: { 
        type: Number, 
        default: 0 
    },
    
    /**
     * @property {Boolean} isWhale
     * Compliance Flag: Set to 'true' if the investor hits the 10% Anti-Whale Cap.
     * Enforced by the Settlement Job to maintain decentralization.
     */
    isWhale: { 
        type: Boolean, 
        default: false 
    },
    
    /**
     * @property {Date} lastContributionDate
     * Audit Timestamp: Records the most recent financial activity.
     */
    lastContributionDate: { 
        type: Date, 
        default: Date.now 
    }
}, { 
    /**
     * Timestamps ensure a clear audit trail for Philip and Daniel
     * as per transparency requirements.
     */
    timestamps: true 
});

// Exporting using ES Module syntax for seamless integration with server.js
const Investor = mongoose.model('Investor', InvestorSchema);
export default Investor;
