/**
 * Initial Mint Configuration - MapCap Tokenomics v1.7.5 (TypeScript Optimized)
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings (Tokenomics)
 * ---------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Defines the core supply constants for the MapCap Genesis Mint.
 * These values are the foundation for the "Value 2" (Spot Price) 
 * calculation and the final LP (Liquidity Pool) transition.
 */

/**
 * @interface IMintConfig
 * Strict typing for the Mint Configuration to ensure numeric integrity.
 */
interface IMintConfig {
    readonly TOTAL_MINT: number;
    readonly IPO_POOL: number;
    readonly LP_POOL: number;
    readonly PRECISION: number;
}

const MintConfig: IMintConfig = {
    /**
     * TOTAL_MINT_SUPPLY: 4,000,000
     * The absolute hard-cap for the MapCap ecosystem.
     * This ensures long-term scarcity and value preservation.
     */
    TOTAL_MINT: 4000000,

    /**
     * IPO_POOL_ALLOCATION: 2,181,818
     * Specifically reserved for the 4-week dynamic pricing IPO.
     * Formula Impact: Current Spot Price = IPO_POOL / Total Pi Invested.
     */
    IPO_POOL: 2181818,

    /**
     * LP_POOL_RESERVE: 1,818,182
     * Reserved for market depth post-IPO settlement.
     * This pool is utilized only after the Whale-Shield protocol is finalized.
     */
    LP_POOL: 1818182,

    /**
     * PRECISION_STANDARD: 6
     * Standardized decimal precision for Pi Network compatibility.
     */
    PRECISION: 6
};

/**
 * ARCHITECTURAL NOTE:
 * ALPHA_GAIN is now a dynamic property in the Financial Engine, 
 * derived from the IPO_POOL/TOTAL_MINT ratio to maintain accuracy.
 * Object.freeze prevents accidental runtime mutations.
 */
export default Object.freeze(MintConfig);
