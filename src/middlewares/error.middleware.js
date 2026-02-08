/**
 * errorMiddleware - Global Exception Handler
 * ---------------------------------------------------------
 * [span_5](start_span)Catches all internal errors to prevent app crashes in the Pi Browser.[span_5](end_span)
 * Ensures that the pioneer always receives a professional response.
 */
const errorMiddleware = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    console.error(`[SYSTEM ERROR] ${new Date().toISOString()}: ${err.message}`);

    res.status(statusCode).json({
        success: false,
        message: err.message || "An unexpected system error occurred.",
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = errorMiddleware;

