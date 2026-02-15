/**
 * PriceService - Dynamic Pricing Engine v1.6.1 (Institutional Grade)
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's "Water-Level" Model
 * ---------------------------------------------------------
 * STRATEGY: 
 * Calculates 'Spot Price' by balancing fixed supply vs real-time pool.
 * Supports Philip's requirement for dynamic price updates as the 
 * total IPO balance fluctuates during the 4-week cycle.
 */

export const IPO_MAPCAP_SUPPLY = 2181818;

class PriceService {
    static IPO_MAPCAP_SUPPLY = IPO_MAPCAP_SUPPLY;

    /**
     * @method calculateDailySpotPrice
     * @desc Formula: Fixed Supply / Total Contributed Pi.
     * Price updates dynamically as more Pioneers join or exit.
     */
    static calculateDailySpotPrice(totalPiInvested) {
        if (!totalPiInvested || totalPiInvested <= 0) {
            return 0;
        }
        return IPO_MAPCAP_SUPPLY / totalPiInvested;
    }

    static formatPrice(price) {
        if (!price || isNaN(price)) return "0.000000";
        return Number(price).toFixed(6);
    }

    static formatPriceForDisplay(price) {
        if (!price || isNaN(price)) return "0.0000";
        return Number(price).toFixed(4);
    }
}

export { PriceService };
export default PriceService;
