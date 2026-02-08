/**
 * Investor Model - Tracks IPO Participants
 * This schema stores investment data needed for the 4-week cycle 
 * and the final 10% Whale Cap calculation.
 */
const mongoose = require('mongoose');

const InvestorSchema = new mongoose.Schema({
    piAddress: { 
        type: String, 
        required: true, 
        unique: true // Each Pi wallet is a unique investor
    },
    totalPiContributed: { 
        type: Number, 
        default: 0 
    },
    sharePercentage: { 
        type: Number, 
        default: 0 
    },
    isWhale: { 
        type: Boolean, 
        default: false 
    },
    lastContributionDate: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

module.exports = mongoose.model('Investor', InvestorSchema);

