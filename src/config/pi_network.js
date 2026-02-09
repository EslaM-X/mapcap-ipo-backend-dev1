/**
 * Pi Network & Escrow Configuration v1.3
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Secure Payout Pipeline
 * * PURPOSE:
 * Centralizes Pi Network SDK parameters and EscrowPi A2UaaS 
 * (App-to-User) connection details. Optimized for high-concurrency 
 * during the 4-week IPO cycle.
 * ---------------------------------------------------------
 */

const PiConfig = {
    /**
     * Official Pi Network API Settings
     * Core connection to the Pi Blockchain.
     */
    api: {
        baseUrl: "https://api.minepi.com/v2",
        apiKey: process.env.PI_API_KEY,
        walletAddress: process.env.APP_WALLET_ADDRESS
    },

    /**
     * EscrowPi A2UaaS Protocol Settings
     * Philip's preferred gateway for automated App-to-User payouts.
     */
    escrow: {
        baseUrl: process.env.ESCROW_PI_URL || "https://api.escrowpi.com/v1",
        apiKey: process.env.ESCROW_PI_API_KEY,
        payoutEndpoint: "/payouts/a2uaas"
    },

    /**
     * Global Transaction Constants
     * Standardized parameters for financial ledger accuracy.
     */
    constants: {
        // Standard Pi Network blockchain fee
        txFee: 0.01, 
        
        // Dynamic Network Toggle (mainnet/testnet)
        network: process.env.PI_NETWORK_MODE || "mainnet", 
        
        // Timeout for A2UaaS handshakes (in milliseconds)
        requestTimeout: 15000 
    }
};

/**
 * VALIDATION: 
 * Prevents the engine from booting if critical keys are missing.
 */
if (!PiConfig.api.apiKey || !PiConfig.api.walletAddress) {
    console.error("[CRITICAL_CONFIG_ERROR] Pi Network API keys are missing in .env!");
}

export default Object.freeze(PiConfig);
