const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY, JWT_REFRESH_SECRET_KEY, REFRESH_TOKEN_EXPIRATION_TIME, ACCESS_TOKEN_EXPIRATION_TIME} = require('./constants');
const {setValueToRedis, getValueFromRedis} = require('./redis');

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
    // sign the payload with JSON Web Token Secret, and expiration time
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
    return new Promise ((resolve, reject) => {
        jwt.sign(payload, JWT_REFRESH_SECRET_KEY, { expiresIn: REFRESH_TOKEN_EXPIRATION_TIME }, async(err, token) => {
            // if there is an error, reject the promise with the error message
            if (err) {
                reject(res.status(500).json({status:false, message: err.message}));
            } 
                // resolve the promise with the token value
                const r = await setValueToRedis({key: `refresh_token_${user_id}`, value: token , timeType: 'EX', time: REFRESH_TOKEN_EXPIRATION_TIME});
                console.log(r)
                resolve(token);
            
        });
   });
}


/**
* Verifies a JSON Web Token (JWT) using a secret key and returns the decoded token.
* @param {string} token - The JWT to verify.
* @returns {Object} - The decoded token.
*/
const verifyToken = (token, res) => {
    return new Promise ((resolve, reject) => {
        jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
            // If there's an error, return an error response
            if (err) {
              reject(res.status(401).json({ status:false, message: err.message }));
            }
            // If the JWT is valid, return the decoded token
            resolve(decoded);
        });
    });
}

const verifyRefreshToken = (refreshToken, res) => {
    return new Promise ((resolve, reject) => {
        jwt.verify(refreshToken, JWT_REFRESH_SECRET_KEY, async(err, decoded) => {
            // If there's an error, return an error response
            if (err) {
              reject(res.status(401).json({ status:false, message: err.message }));
            }
            // console.log(decoded);
            const result = await getValueFromRedis({ key: `refresh_token_${decoded.id}` });
            
            if(refreshToken === result){
                resolve(decoded); 
            }else{
                reject(res.status(500).json({ status:false, message: 'internal server error' }));
            }
        });
    });
}

module.exports = {generateJsonWebToken, generateRefreshToken, verifyToken, verifyRefreshToken};