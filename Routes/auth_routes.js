const express = require("express");
const router = express.Router();
const LoginValidator = require("../Validations/LoginValidator");
const RegisterValidator = require("../Validations/RegisterValidator");
const {checkUser, loginUser , logOut, refreshToken} = require("../Controllers/UserController");
const userController = require("../Controllers/UserController");
const authLimiter = require("../Middlewares/reate_limiter");
const isAuthenticated = require("../Middlewares/is_auth_middleware");
const passport = require("passport");
const logger = require("../Middlewares/auth_middleware");

/**
 * Auth Routes with Rate Limitter middleware
 */

/**
 * if you want to show error logger middeware then
 * router.post("/login", authLimiter, logger, (req, res) => {
 */
// router.post("/login", authLimiter,logger, (req, res) => {
//     // Validating the data from the form which is coming from the client
//     const { errors, isValid } = LoginValidator(req.body);

//     if (!isValid) {
//         return res.status(400).json(errors);
//     }else{
//         return loginUser({email:req.body.email , password: req.body.password}, res);
//     }
// });

router.post("/login", authLimiter,logger, loginUser);


router.post('/register', (req, res) => {
    const { errors, isValid } = RegisterValidator(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }else{
        return checkUser({name: req.body.name, email: req.body.email, password: req.body.password}, res);
    }
});

// router.delete('/logout', async(req, res, next)=>{
//     try {
//         const {refreshToken} = req.body;
//         if(!refreshToken) res.status(401).json({status:false, message: 'No refresh token found' });
//         const user_obj = await verifyRefreshToken(refreshToken, res);
//         RedisClient.del(`refresh_token_${user_obj.id}`);
//         return res.status(200).json({status:true, message: 'Logged out successfully'});

//     } catch (error) {
//         next(error);
//     }
  
// });
router.delete('/logout', logOut);

router.get('/me', isAuthenticated, (req, res) => {
    return res.status(200).json({status:true, user:req.user});
})

// router.get('/me', passport.authenticate('jwt', { session: false }),(req, res)=>{
//         res.status(200).json({status:true, user:req.user});
//     }
// );

router.post('/refresh-token', refreshToken);

module.exports = router;