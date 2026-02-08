/**
 * Initial Mint Configuration - MapCap Tokenomics
 * ---------------------------------------------------------
 * [span_20](start_span)Defines the initial supply of MapCap tokens as per Philip's Use Case.[span_20](end_span)
 * [span_21](start_span)Establishes the ratio between IPO and LP pools to ensure 20% capital gain.[span_21](end_span)
 */

const MapCapTokenomics = {
    [span_22](start_span)// Total minted at commencement[span_22](end_span)
    TOTAL_MINT: 4000000,

    [span_23](start_span)// Designated for IPO Pioneers[span_23](end_span)
    IPO_POOL: 2181818,

    [span_24](start_span)// Designated for Liquidity Pool (LP)[span_24](end_span)
    LP_POOL: 1818182,

    [span_25](start_span)// The fixed IPO duration[span_25](end_span)
    DURATION_WEEKS: 4,

    [span_26](start_span)[span_27](start_span)// Capital increase target for IPO pioneers[span_26](end_span)[span_27](end_span)
    CAPITAL_GAIN_TARGET: 1.20, // 20% increase
};

module.exports = MapCapTokenomics;

