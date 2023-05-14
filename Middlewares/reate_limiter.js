const rateLimit = require("express-rate-limit");
const humanizeDuration = require("humanize-duration");


/**
 * A rate-limiter middleware function for authentication requests.
 * Limits each IP to 5 requests per minute, and returns an error message
 * if this limit is exceeded.
 */
const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // limit each IP to 5 requests per windowMs
    message: `Too many login attempts. Please try again after ${humanizeDuration(1 * 60 * 1000, { round: true })}.`,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (request, response, next, options) => {
      // Send the response with the specified status code and error message.
      response.status(options.statusCode).json({success: false, message: options.message});
    },
  });

module.exports = authLimiter;