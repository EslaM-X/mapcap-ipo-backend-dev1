/**
 * Pi Network & Escrow Configuration
 * ---------------------------------------------------------
 * This file centralizes all Pi Network SDK parameters and 
 * EscrowPi A2UaaS (App-to-User) connection details.
 * Optimized for the 4-week high-intensity IPO cycle.
 */

const PiConfig = {
    // Official Pi Network API Settings
    api: {
        baseUrl: "https://api.minepi.com/v2",
        apiKey: process.env.PI_API_KEY,
        walletAddress: process.env.APP_WALLET_ADDRESS
    },

    // EscrowPi A2UaaS Protocol Settings (Philip's Preferred Gateway)
    escrow: {
        baseUrl: process.env.ESCROW_PI_URL || "https://api.escrowpi.com/v1",
        apiKey: process.env.ESCROW_PI_API_KEY,
        payoutEndpoint: "/a2uaas"
    },

    // Global Transaction Constants
    constants: {
        fee_deduction: 0.01, // Standard Pi Network transaction fee
        network: "mainnet"    // Target network for the 2026 launch
    }
};

module.exports = PiConfig;
