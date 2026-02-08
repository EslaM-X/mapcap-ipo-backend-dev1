const express = require('express');
const router = express.Router();
const PriceService = require('../services/price.service');

// المسار الخاص ببيانات لوحة التحكم (IPO Pulse Dashboard)
router.get('/dashboard-stats', async (req, res) => {
    try {
        // في العرض التجريبي، سنفترض أرقاماً حتى نربط قاعدة البيانات فعلياً
        const totalPiInvested = 500000; // مثال لإجمالي الـ Pi المستثمر
        const totalInvestors = 1250;    // عدد المستثمرين

        // حساب السعر اللحظي بناءً على معادلة فيليب البسيطة
        const currentPrice = PriceService.calculateDailySpotPrice(totalPiInvested);

        res.json({
            success: true,
            dashboardName: "IPO Pulse Dashboard", // التسمية الجديدة الجذابة
            stats: {
                totalPi: totalPiInvested,
                investorsCount: totalInvestors,
                spotPrice: currentPrice,
                mapCapRemaining: 2181818 - (totalPiInvested * currentPrice) // مثال توضيحي
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;

