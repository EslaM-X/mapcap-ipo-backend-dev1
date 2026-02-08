// الكمية الثابتة لـ IPO MapCap حسب الوثيقة
[span_3](start_span)const IPO_MAPCAP_AMOUNT = 2181818;[span_3](end_span)

class PriceService {
  /**
   * حساب السعر اليومي (Spot-price)
   * المعادلة: كمية IPO MapCap / إجمالي الـ Pi في المحفظة
   */
  static calculateDailySpotPrice(totalPiInWallet) {
    if (totalPiInWallet <= 0) return 0;
    // القسمة البسيطة كما طلب فيليب
    [span_4](start_span)return IPO_MAPCAP_AMOUNT / totalPiInWallet;[span_4](end_span)
  }
}

module.exports = PriceService;

