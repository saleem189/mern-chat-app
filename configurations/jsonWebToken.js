const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY, JWT_REFRESH_SECRET_KEY, REFRESH_TOKEN_EXPIRATION_TIME, ACCESS_TOKEN_EXPIRATION_TIME} = require('./constants');
const {setValueToRedis, getValueFromRedis} = require('./redis');

/**
 * Generate JSON Web Token for user authentication
 * @param {Object} user - The user object contains user_id, user_name, user_email
 * @param {Object} res - The response object to send the token or error
 * @returns {Promise<string>} - A promise that resolves with the token string or rejects with an error message
 */
const generateJsonWebToken = ({user_id, user_name, user_email, user_isActive}, res) => {
    // create payload for JWT containing user_id, user_name, user_email
    const payload = {
        id: user_id,
        name: user_name,
        email:user_email,
        isActive: user_isActive
    };

    /**
     * Sign the payload with JSON Web Token Secret, and expiration time
     * @param {function} resolve - A function to resolve the promise with the token value
     * @param {function} reject - A function to reject the promise with an error message
     * @returns {void}
     */
    return new Promise ((resolve, reject) => {
        jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: ACCESS_TOKEN_EXPIRATION_TIME }, (err, token) => {
            // if there is an error, reject the promise with the error message
            if (err) {
             reject(res.status(500).json({status:false, message: err.message}));
            } else {
            // resolve the promise with the token value
             resolve(token);
            }
        });
   });
};


/**
 * Generates a new JWT refresh token and stores it in Redis
 * @param {Object} user - The user object to sign the token with. Must contain user_id, user_name, and user_email properties.
 * @returns {string} - The generated refresh token
 */
const generateRefreshToken = ({user_id, user_name, user_email , user_isActive}) => {
    // create payload for JWT containing user_id, user_name, user_email
    const payload = {
        id: user_id,
        name: user_name,
        email:user_email,
        isActive:user_isActive
    }

    // Generate the refresh token using the user object, JWT secret key, and expiration time
    return new Promise ((resolve, reject) => {
        jwt.sign(payload, JWT_REFRESH_SECRET_KEY, { expiresIn: REFRESH_TOKEN_EXPIRATION_TIME }, async(err, token) => {
            // if there is an error, reject the promise with the error message
            if (err) {
                reject(res.status(500).json({status:false, message: err.message})); // reject promise with error message
            } 
            const r = await setValueToRedis({key: `refresh_token_${user_id}`, value: token , timeType: 'EX', time: REFRESH_TOKEN_EXPIRATION_TIME}); // set value to Redis
            console.log(r);
            resolve(token); // resolve the promise with the token value
        });
   });
}



/**
 * Verifies a JSON Web Token (JWT) using a secret key and returns the decoded token.
 * @param {string} token - The JWT to verify.
 * @param {Object} res - The response object for error handling.
 * @returns {Promise<Object>} - A promise that resolves to the decoded token if it's valid, or rejects with an error response if it's not.
 */
const verifyToken = (token, res) => {
    return new Promise((resolve, reject) => {
      // Verify the token using the JWT_SECRET_KEY
      jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
        // If there's an error, return an error response
        if (err) {
          reject(res.status(401).json({ status: false, message: err.message }));
        }
        // If the JWT is valid, return the decoded token
        resolve(decoded);
      });
    });
  };
  

/**
 * Verify refresh token using JWT library and Redis storage
 * @param {string} refreshToken - the refresh token to be verified
 * @param {object} res - the response object to be used in case of errors
 * @returns {Promise<object>} - a Promise that resolves to the decoded refresh token payload
 */
const verifyRefreshToken = (refreshToken, res) => {
    return new Promise(async (resolve, reject) => {
      // Verify the refresh token using the JWT_REFRESH_SECRET_KEY
      jwt.verify(refreshToken, JWT_REFRESH_SECRET_KEY, async (err, decoded) => {
        // If there's an error, reject the Promise with an error response
        if (err) {
          reject(res.status(401).json({ status: false, message: err.message }));
        }
  
        // Get the stored refresh token from Redis
        const result = await getValueFromRedis({ key: `refresh_token_${decoded.id}` });
  
        // If the provided refresh token matches the stored refresh token, resolve the Promise with the decoded payload
        if (refreshToken === result) {
          resolve(decoded);
        } else {
          // Otherwise, reject the Promise with an error response
          reject(res.status(500).json({ status: false, message: 'internal server error/ unauthorized' }));
        }
      });
    });
}
  

module.exports = {generateJsonWebToken, generateRefreshToken, verifyToken, verifyRefreshToken};