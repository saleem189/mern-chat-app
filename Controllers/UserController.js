// Load User model
const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const {generateJsonWebToken, generateRefreshToken, verifyRefreshToken} = require("../configurations/jsonWebToken");
const { delValueFromRedis } = require("../configurations/redis");


/**
 * Check if a user already exists in the database. If there is no existing user, create one.
 * @param {Object} user - An object containing the user's email, password, and name.
 * @param {Object} res - The response object to send back to the client.
 */
const checkUser = ({email: email, password: password , name: name}, res) => {
    // Find a user in the database with the given email
    User.findOne({email:email}).then(user => {
        // If there is already a user with the given email, send a 400 error response with a message
        if (user) {
            res.status(400).json({email: "Email already exists"});
        } else {
            // If there is no existing user with the given email, create one with the given name, email, and password
            createUser({name: name, email: email, password: password}, res);
        }
    });
}


/**
 * Logs in a user with the provided email and password.
 * @param {Object} userDetails - An object containing the email and password of the user to be logged in.
 * @param {Object} res - The response object used to send the result of the login request.
 */
const loginUser = (req, res, next) => {
    const {email, password} = req.body;
    // Find the user with the given email
    User.findOne({email:email}).then(user => {
        // If the user does not exist, return an error
        if (!user) return res.status(404).json({emailnotfound: "Email does not exist!"});
        // Otherwise, compare the provided password with the user's password
        comparePassword({password:password, hash:user.password, user:user}, res);
    });
}

/**
 * Compares a password with a hash and generates a JSON Web Token if they match.
 * If the password doesn't match the hash, sends a 400 response with "Password incorrect" in the body.
 * @param {string} password - The password to compare to the hash
 * @param {string} hash - The hash to compare to the password
 * @param {object} user - The user object
 * @param {object} res - The response object
 */
const comparePassword = ({password, hash, user}, res) => {
    bcrypt.compare(password, hash).then( async (isMatch) => {
       if(isMatch){
            user.isActive = true;
            user.save();
            const accessToken = await generateJsonWebToken({user_id: user._id, user_name: user.name, user_email: user.email , user_isActive: user.isActive}, res);
            const refreshToken = await generateRefreshToken({user_id: user._id, user_name: user.name, user_email: user.email, user_isActive: user.isActive}); 
            return res.status(200).json({status:true, accessToken, refreshToken});
       }else{
           res.status(400).json({passwordincorrect: "Password incorrect"});
       }
    });
}

/**
 * Creates a new user and saves it to the database
 * @param {object} userDetails - An object containing the user's name, email, and password
 * @param {object} res - The response object to send back to the client
 */
const createUser = (userDetails, res) =>{

    // Create a new user object
    const newUser = new User({
        name: userDetails.name,
        email: userDetails.email,
        password: userDetails.password
    });

    // Hash password before saving in database
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            // Set user's password to the hashed value
            newUser.password = hash;

            // Save user to the database
            newUser
                .save()
                .then(user => res.status(201).json({status:true, user:user}))
                .catch(err => res.status(500).json(err));
        });
    });
}

/**
 * Refreshes access token and generates new refresh token
 * @param {Object} req - request object containing refreshToken
 * @param {Object} res - response object
 * @param {Function} next - next middleware function
 * @returns {Object} - json object containing status, user object, access token, and refresh token
 */
const refreshToken = async (req,res, next) => {
    try {
        const {refreshToken} = req.body;
        if(!refreshToken) res.status(401).json({status:false, message: 'No refresh token found' });
        const user_obj = await verifyRefreshToken(refreshToken, res);
        const accessToken = await generateJsonWebToken({user_id: user_obj.id, user_email: user_obj.email, user_name: user_obj.name});
        const refToken = await generateRefreshToken({user_id: user_obj.id, user_email: user_obj.email, user_name: user_obj.name});
        return res.json({status:true, accessToken, refToken});
    } catch (error) {
        next(error);
    }

}

/**
 * Logs out a user by deleting their refresh token from Redis.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} - The response object containing a status and message.
 */
const logOut = async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
  
      // If there's no refresh token, return an error response
      (!refreshToken) ? res.status(401).json({ status: false, message: 'No refresh token found' }):null;
  
      // Verify the refresh token and get the user object
      const user_obj = await verifyRefreshToken(refreshToken, res);
      User.findByIdAndUpdate(user_obj.id).then(user => {
          user.isActive = false;
          user.save();
      });
  
      // Delete the refresh token from Redis
      delValueFromRedis({ key: `refresh_token_${user_obj.id}` });

      // Return a success response
      return res.status(200).json({ status: true, message: 'Logged out successfully' });
    } catch (error) {
      // Call the error handling middleware
      next(error);
    }
};
  

module.exports = {checkUser, loginUser , refreshToken, logOut
// logOut:  async(req, res, next)=>{
//     try {
//         const {refreshToken} = req.body;
//         if(!refreshToken) res.status(401).json({status:false, message: 'No refresh token found' });
//         const user_obj = await verifyRefreshToken(refreshToken, res);
//         delValueFromRedis({key:`refresh_token_${user_obj.id}`});
//         // RedisClient.del(`refresh_token_${user_obj.id}`);
//         return res.status(200).json({status:true, message: 'Logged out successfully'});

//     } catch (error) {
//         next(error);
//     }
  
// }

};