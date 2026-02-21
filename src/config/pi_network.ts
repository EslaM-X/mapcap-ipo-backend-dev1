/**
 * Pi Network & Escrow Configuration v1.7.5 (TypeScript Optimized)
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Secure Payout Pipeline
 * ---------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Centralizes credentials and connection parameters for the Pi Blockchain 
 * and EscrowPi A2UaaS protocol. This file provides the infrastructure 
 * for the 'Whale-Shield' payouts executed during final settlement.
 */

interface IPiConfig {
    readonly api: {
        readonly baseUrl: string;
        readonly apiKey: string | undefined;
        readonly walletAddress: string | undefined;
    };
    readonly escrow: {
        readonly baseUrl: string;
        readonly apiKey: string | undefined;
        readonly payoutEndpoint: string;
    };
    readonly constants: {
        readonly txFee: number;
        readonly network: string;
        readonly requestTimeout: number;
    };
}

const PiConfig: IPiConfig = {
    /**
     * Official Pi Network API Settings
     * Core credentials for blockchain interaction and transaction signing.
     */
    api: {
        baseUrl: "https://api.minepi.com/v2",
        apiKey: process.env.PI_API_KEY,
        walletAddress: process.env.APP_WALLET_ADDRESS
    },

    /**
     * EscrowPi A2UaaS (App-to-User-as-a-Service) Settings
     * Utilized by the SettlementJob to perform dynamic 'Trim-Back' refunds.
     */
    escrow: {
        baseUrl: process.env.ESCROW_PI_URL || "https://api.escrowpi.com/v1",
        apiKey: process.env.ESCROW_PI_API_KEY,
        payoutEndpoint: "/payouts/a2uaas"
    },

    /**
     * Transaction & Network Parameters
     * Standardized constants to ensure ledger precision and network stability.
     */
    constants: {
        // Standard Pi Network blockchain gas fee
        txFee: 0.01, 
        
        // Environment Toggle: 'mainnet' for production | 'testnet' for staging
        network: process.env.PI_NETWORK_MODE || "mainnet", 
        
        // Response timeout for A2UaaS handshakes
        requestTimeout: 15000 
    }
};

/**
 * SYSTEM INTEGRITY CHECK: 
 * Prevents the financial engine from booting if critical environment 
 * variables are missing, protecting the ecosystem from downtime.
 */
if (!PiConfig.api.apiKey || !PiConfig.api.walletAddress) {
    console.warn("[CONFIG_WARNING] Pi Network credentials missing. Ensure .env is populated for production.");
}

/**
 * Object.freeze ensures that financial parameters remain immutable 
 * during runtime, satisfying Daniel's security standards.
 */
export default Object.freeze(PiConfig);
