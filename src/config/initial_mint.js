/**
 * Initial Mint Configuration - MapCap Tokenomics
 * ---------------------------------------------------------
 * Core supply constants based on Philip Jennings' Use Case.
 * Note: ALPHA_GAIN (1.20) is removed as it is inherently 
 * calculated via the IPO_POOL to TOTAL_MINT ratio.
 */

module.exports = {
    // Total supply to be minted at system commencement
    TOTAL_MINT: 4000000,

    // Supply allocated for the 4-week IPO phase
    IPO_POOL: 2181818,

    // Supply reserved for the Liquidity Pool (LP) transition
    LP_POOL: 1818182
};
