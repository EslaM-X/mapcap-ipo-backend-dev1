/**
 * validateWithdrawal - Withdrawal Range Checker
 * ---------------------------------------------------------
 * [span_8](start_span)Ensures withdrawal percentage is between 0% and 100% as per Philip's specs.[span_8](end_span)
 */
const validateWithdrawal = (req, res, next) => {
    const { percentage } = req.body;
    if (percentage <= 0 || percentage > 100) {
        return res.status(400).json({
            success: false,
            message: "Withdrawal percentage must be between 0.01% and 100%."
        });
    }
    next();
};

module.exports = { validateWithdrawal };
