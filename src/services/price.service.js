/**
 * PriceService - Dynamic Pricing Engine v1.6.2 (Institutional Grade)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's "Water-Level" Model
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE: 
 * Calculates 'Spot Price' by balancing fixed supply against real-time pool.
 * Implements the "Scarcity Algorithm" where the price per MapCap asset 
 * fluctuates dynamically based on the total Pi contributed.
 * -------------------------------------------------------------------------
 */

// Total MapCap tokens allocated for the IPO phase as per the Whitepaper
export const IPO_MAPCAP_SUPPLY = 2181818;

class PriceService {
    // Static reference to ensure supply is accessible via class context
    static IPO_MAPCAP_SUPPLY = IPO_MAPCAP_SUPPLY;

    /**
     * @method calculateDailySpotPrice
     * @param {number} totalPiInvested - Total aggregate Pi in the IPO pool.
     * @desc Formula: Fixed Supply (2,181,818) / Total Contributed Pi.
     * Price updates in real-time as the 'Water-Level' rises or falls.
     */
    static calculateDailySpotPrice(totalPiInvested) {
        if (!totalPiInvested || totalPiInvested <= 0) {
            // Returns 0 to prevent Infinity or Division by Zero errors
            return 0;
        }
        return IPO_MAPCAP_SUPPLY / totalPiInvested;
    }

    /**
     * @method formatPrice
     * @desc Standard formatting for database and ledger records (6 decimal precision).
     */
    static formatPrice(price) {
        if (!price || isNaN(price)) return "0.000000";
        return Number(price).toFixed(6);
    }

    /**
     * @method formatPriceForDisplay
     * @desc Clean formatting for UI 'Pulse Dashboard' to enhance readability for Pioneers.
     */
    static formatPriceForDisplay(price) {
        if (!price || isNaN(price)) return "0.0000";
        return Number(price).toFixed(4);
    }
}



export { PriceService };
export default PriceService;
