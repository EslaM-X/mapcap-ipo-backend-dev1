/**
 * Investor Schema - Core Investment & Equity Tracker
 * ---------------------------------------------------------
 * This model stores the cumulative data for each IPO participant.
 * Essential for calculating the 10% Whale Cap and managing 
 * the 10-month vesting cycle as per Philip's Use Case.
 */
const mongoose = require('mongoose');

const InvestorSchema = new mongoose.Schema({
    // The unique Pi Network wallet address (Pioneer ID)
    piAddress: { 
        type: String, 
        required: true, 
        unique: true,
        index: true 
    },
    
    // Total amount of Pi contributed during the 4-week cycle (Value 3)
    totalPiContributed: { 
        type: Number, 
        default: 0,
        min: 0
    },

    // Amount of MapCap allocated based on the Daily Spot Price
    // Necessary for the 10% monthly release (Vesting Job)
    allocatedMapCap: {
        type: Number,
        default: 0
    },
    
    // Proportional share relative to the total 2,181,818 MapCap pool
    sharePercentage: { 
        type: Number, 
        default: 0 
    },
    
    // Flag to identify if the pioneer has exceeded the 10% limit
    // Automatically updated by the Settlement Job
    isWhale: { 
        type: Boolean, 
        default: false 
    },
    
    // Tracking the last activity for audit and transparent reporting
    lastContributionDate: { 
        type: Date, 
        default: Date.now 
    }
}, { 
    timestamps: true // Automatically manages createdAt and updatedAt
});

module.exports = mongoose.model('Investor', InvestorSchema);
