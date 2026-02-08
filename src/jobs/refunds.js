const PaymentService = require('../services/payment.service'); // خدمة الدفع الموحدة

// دالة رد أموال الحيتان (تنفذ يدوياً بعد انتهاء الـ IPO)
const runWhaleRefunds = async (totalPiPool, investors) => {
    const WHALE_CAP = totalPiPool * 0.10; // حد الـ 10%

    for (let investor of investors) {
        if (investor.amountPi > WHALE_CAP) {
            const excessAmount = investor.amountPi - WHALE_CAP;
            
            console.log(`Processing refund for ${investor.piAddress}: ${excessAmount} Pi`);
            
            // استدعاء خدمة الدفع الموحدة بالبارامترات الـ 3 فقط كما طلب فيليب
            await PaymentService.transferPi(investor.piAddress, excessAmount);
        }
    }
    console.log("Whale refunds completed successfully.");
};

