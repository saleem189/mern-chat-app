/**
 * Middleware that logs request body if Content-Type is application/json, else sends a 400 response.
 * @param {Object} request - Express request object
 * @param {Object} response - Express response object
 * @param {Function} next - Express next middleware function
 */
const errorLogger = (request, response, next) => {
    // Check if Content-Type is application/json
    if (request.header('Content-Type') === "application/json") {
        // Log request body
        console.log(request.body);
        // Call next middleware function
        next();
    } else {
        // Send 400 response with error message
        response.status(400).json({status:false,message:"Content-Type must be application/json Or it is not provided"});
    }
}

module.exports = errorLogger;