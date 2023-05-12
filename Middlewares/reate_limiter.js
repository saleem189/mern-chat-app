const rateLimit = require("express-rate-limit");
const humanizeDuration = require("humanize-duration");


const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: `Too many login attempts. Please try again after ${humanizeDuration(1 * 60 * 1000, { round: true })}.`,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (request, response, next, options) => response.status(options.statusCode).json({success: false, message: options.message}),
});

module.exports = authLimiter;