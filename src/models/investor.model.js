/**
 * Investor Schema - Core Financial Equity Ledger v1.5
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel
 * * DESCRIPTION:
 * This model serves as the primary decentralized ledger for all IPO participants.
 * It strictly enforces the 10% Anti-Whale Ceiling and tracks the 10-month 
 * linear vesting schedule as defined in the official project specifications.
 * ---------------------------------------------------------
 */

import mongoose from 'mongoose';

const InvestorSchema = new mongoose.Schema({
    /**
     * @property {String} piAddress
     * Unique Pi Network wallet identifier (Pioneer ID).
     * Indexed to ensure millisecond latency during high-traffic IPO spikes.
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
     * Directly feeds "Value 3" on the Real-Time Pulse Dashboard.
     */
    totalPiContributed: { 
        type: Number, 
        default: 0,
        min: [0, 'Contribution balance cannot be negative']
    },

    /**
     * @property {Number} allocatedMapCap
     * Total MapCap equity assigned based on the Daily Scarcity Spot Price.
     * This balance is subject to the 10-month (10%/mo) linear vesting release.
     */
    allocatedMapCap: {
        type: Number,
        default: 0,
        min: 0
    },
    
    /**
     * @property {Number} mapCapReleased
     * Audit field: Tracks total MapCap successfully transferred to the Pioneer.
     * Prevents over-distribution during the automated monthly vesting jobs.
     */
    mapCapReleased: {
        type: Number,
        default: 0
    },

    /**
     * @property {Number} sharePercentage
     * Proportional equity ownership within the 2,181,818 MapCap Global Pool.
     * Formula: (Individual Allocation / Total Supply) * 100.
     */
    sharePercentage: { 
        type: Number, 
        default: 0 
    },
    
    /**
     * @property {Boolean} isWhale
     * Compliance Flag: Triggers when the investor hits the 10% Anti-Whale Ceiling.
     * Managed by the SettlementJob to maintain ecosystem decentralization.
     */
    isWhale: { 
        type: Boolean, 
        default: false 
    },
    
    /**
     * @property {Number} vestingMonthsCompleted
     * Tracks the progress of the 10-month vesting cycle (0 to 10).
     */
    vestingMonthsCompleted: {
        type: Number,
        default: 0
    },

    /**
     * @property {Date} lastContributionDate
     * Records the timestamp of the last financial activity for audit trails.
     */
    lastContributionDate: { 
        type: Date, 
        default: Date.now 
    }
}, { 
    /**
     * Enable timestamps to provide immutable 'createdAt' and 'updatedAt' 
     * fields for Daniel's financial auditing and transparency reports.
     */
    timestamps: true 
});

// Compound Index for optimized financial reporting
InvestorSchema.index({ totalPiContributed: -1, isWhale: 1 });

const Investor = mongoose.model('Investor', InvestorSchema);

export default Investor;
