// src/services/payout.service.js
const axios = require('axios');

const PI_API_KEY = process.env.PI_API_KEY; // المفتاح اللي دانيال بعته

const simpleWithdraw = async (userWallet, piAmount) => {
    // أبسط شكل ممكن للطلب (رؤية فيليب ودانيال)
    const response = await axios.post('https://api.minepi.com/v2/payments/a2uaas', {
        payer: "APP_WALLET_ADDRESS", 
        payee: userWallet,
        amount: piAmount
    }, {
        headers: { 'Authorization': `Key ${PI_API_KEY}` }
    });
    
    return response.data;
};

