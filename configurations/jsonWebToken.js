const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY, REFRESH_TOKEN_EXPIRATION_TIME, ACCESS_TOKEN_EXPIRATION_TIME} = require('./constants');
const redisClient = require('./redis');

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
  const refreshToken = generateRefreshToken({user_id:user_id, user_name:user_name, user_email:user_email});  
    // sign the payload with JSON Web Token Secret, and expiration time
    jwt.sign(payload ,JWT_SECRET_KEY,{ expiresIn: ACCESS_TOKEN_EXPIRATION_TIME }, (err, token) => {
        // if there is an error, send 500 status with error message
        if (err) {
            return res.status(500).json({status:false, message: err.message});
        } else {
            // send 200 status with token in Bearer format
            res.status(200).json({
                status:true,
                refresh_token: refreshToken,
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
    // create payload for JWT containing user_id, user_name, user_email
    const payload = {
        id: user_id,
        name: user_name,
        email:user_email
    }

    // Generate the refresh token using the user object, JWT secret key, and expiration time
    const refreshToken = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: REFRESH_TOKEN_EXPIRATION_TIME });
  
    redisClient.connect();
    // Store the refresh token in Redis using the user ID as the key
    redisClient.set(`refresh_token_${user_id}`, refreshToken);
    // Return the generated refresh token
    return refreshToken;
}


/**
* Verifies a JSON Web Token (JWT) using a secret key and returns the decoded token.
* @param {string} token - The JWT to verify.
* @returns {Object} - The decoded token.
*/
const verifyToken = (token, res) => {
    // Verify the JWT with the secret key
    const decoded = jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
        // If there's an error, return an error response
        if (err) {
          return res.status(401).json({ status:false, message: err.message });
        }
        // If the JWT is valid, return the decoded token
        return decoded;
    });
    
    return decoded;
}

module.exports = {generateJsonWebToken, generateRefreshToken, verifyToken};