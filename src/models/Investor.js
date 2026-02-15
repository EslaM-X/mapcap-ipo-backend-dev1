/**
 * Investor Schema - Core Investment & Equity Tracker v1.6.5
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Dynamic IPO Use Case
 * ---------------------------------------------------------
 * PURPOSE: 
 * This model stores cumulative data for each IPO participant.
 * * NOTE ON WHALE-SHIELD (DECENTRALIZATION):
 * Per Philip's requirement, the 10% Whale Cap is NOT enforced at the 
 * schema level during the IPO period to allow for pool fluctuations. 
 * Final enforcement occurs during the Settlement Phase.
 */
const mongoose = require('mongoose');

const InvestorSchema = new mongoose.Schema({
    // The unique Pi Network wallet address (Pioneer ID)
    // Primary key for linking with Pi Browser transactions.
    piAddress: { 
        type: String, 
        required: true, 
        unique: true,
        index: true 
    },
    
    // Total amount of Pi contributed during the 4-week cycle.
    // Allowed to temporarily exceed 10% of the total pool during IPO.
    totalPiContributed: { 
        type: Number, 
        default: 0,
        min: 0
    },

    // Amount of MapCap allocated based on the Daily Spot Price.
    // Base value for the 10-month vesting release (10% monthly).
    allocatedMapCap: {
        type: Number,
        default: 0
    },
    
    // Proportional share relative to the total IPO supply.
    // Calculated dynamically; subject to final Whale-Capping post-IPO.
    sharePercentage: { 
        type: Number, 
        default: 0 
    },
    
    // Flag to identify if the pioneer has exceeded the 10% limit.
    // Status is strictly updated by the 'Settlement Job' at the end of IPO.
    isWhale: { 
        type: Boolean, 
        default: false 
    },
    
    // Tracking the last activity for audit and transparent reporting.
    lastContributionDate: { 
        type: Date, 
        default: Date.now 
    }
}, { 
    timestamps: true // Maintains createdAt and updatedAt for audit trails.
});

// Export the model for use in Controllers and Settlement Jobs.
module.exports = mongoose.model('Investor', InvestorSchema);
