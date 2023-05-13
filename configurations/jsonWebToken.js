const jwt = require('jsonwebtoken');
const redis = require('redis');
const { JWT_SECRET_KEY, REFRESH_TOKEN_EXPIRATION_TIME, ACCESS_TOKEN_EXPIRATION_TIME } = require('./constants');
const redisClient = redis.createClient();

/**
 * Generate JSON Web Token for user authentication
 * @param {Object} user - The user object contains user_id, user_name, user_email
 * @param {Object} res - The response object to send the token or error
 * @returns {void}
 */
const generateJsonWebToken = ({user_id, user_name, user_email}, res) => {
    // create payload for JWT containing user_id, user_name, user_email
    const payload = {
        id: user_id,
        name: user_name,
        email:user_email
    }
    // sign the payload with JSON Web Token Secret, set expiration to 10 minutes
    jwt.sign(payload ,JWT_SECRET_KEY,{ expiresIn: ACCESS_TOKEN_EXPIRATION_TIME }, (err, token) => {
        // if there is an error, send 500 status with error object
        if (err) {
            res.status(500).json({err: err});
        } else {
            // send 200 status with token in Bearer format
            res.status(200).json({
                status:true,
                token: "Bearer " + token
            });
        }
    })
}


/**
 * Generates a new JWT refresh token and stores it in Redis
 * @param {Object} user - The user object to sign the token with
 * @returns {string} - The generated refresh token
 */
const generateRefreshToken = ({user_id, user_name, user_email}) => {
    
    const payload = {
        id: user_id,
        name: user_name,
        email:user_email
    }

    // Generate the refresh token using the user object, JWT secret key, and expiration time
    const refreshToken = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: REFRESH_TOKEN_EXPIRATION_TIME });
  
    // Store the refresh token in Redis using the user ID as the key
    redisClient.set(`refresh_token_${user.id}`, refreshToken);
  
    // Return the generated refresh token
    return refreshToken;
}
module.exports = {generateJsonWebToken, generateRefreshToken};