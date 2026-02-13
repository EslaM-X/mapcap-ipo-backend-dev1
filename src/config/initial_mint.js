/**
 * Initial Mint Configuration - MapCap Tokenomics v1.2
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings (Tokenomics)
 * * PURPOSE:
 * Defines the core supply constants for the MapCap Genesis Mint.
 * These values govern the scarcity model and the transition from 
 * the 4-week IPO phase to the Liquidity Pool (LP) stage.
 * ---------------------------------------------------------
 */

const MintConfig = {
    /**
     * TOTAL_MINT_SUPPLY
     * The absolute hard-cap for the MapCap ecosystem.
     * All calculations must reference this base value.
     */
    TOTAL_MINT: 4000000,

    /**
     * IPO_POOL_ALLOCATION
     * Reserved specifically for the 4-week dynamic pricing IPO.
     * This pool is governed by the 'Water-Level' scarcity formula.
     */
    IPO_POOL: 2181818,

    /**
     * LP_POOL_RESERVE
     * Reserved for the Liquidity Pool transition post-IPO.
     * Ensures market stability and trading depth for the Pioneers.
     */
    LP_POOL: 1818182,

    /**
     * PRECISION_STANDARD
     * Global precision for all minting and distribution calculations.
     */
    PRECISION: 6
};

/**
 * Note: ALPHA_GAIN (1.20) is removed from static config as it is 
 * dynamically derived from the (IPO_POOL / TOTAL_MINT) ratio 
 * within the Financial Engine.
 */
export default Object.freeze(MintConfig);
