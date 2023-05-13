const jwt = require('jsonwebtoken');

// Secret key for JWTs
const secretKey = require('../configurations/keys').jsonWebTokenSecret;

/**
 * Middleware function to check if user is authenticated
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
const isAuthenticated = (req, res, next) => {
  // Get the JWT from the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({status:false, message: 'Authorization header missing' });
  }

  // Extract the JWT from the Authorization header
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({status:false, message: 'JWT missing' });
  }

  // Verify the JWT
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ status:false, message: 'Invalid JWT Or Expired JWT' });
    }
    req.user = decoded;
    next();
  });  
};

module.exports = isAuthenticated;