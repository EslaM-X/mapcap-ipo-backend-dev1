/**
 * Investor Schema - Core Investment Tracker
 * ---------------------------------------------------------
 * This model stores the cumulative data for each IPO participant.
 * It is essential for calculating the 10% Whale Cap at the end 
 * of the 4-week cycle.
 */
const mongoose = require('mongoose');

const InvestorSchema = new mongoose.Schema({
    // The unique Pi Network wallet address of the user
    piAddress: { 
        type: String, 
        required: true, 
        unique: true,
        index: true 
    },
    
    // Total amount of Pi contributed during the 4-week period
    totalPiContributed: { 
        type: Number, 
        default: 0,
        min: 0
    },
    
    // Calculated share percentage relative to the total pool
    sharePercentage: { 
        type: Number, 
        default: 0 
    },
    
    // Flag to identify if the investor has exceeded the 10% limit
    isWhale: { 
        type: Boolean, 
        default: false 
    },
    
    // Tracking the last activity for audit purposes
    lastContributionDate: { 
        type: Date, 
        default: Date.now 
    }
}, { 
    timestamps: true // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('Investor', InvestorSchema);
