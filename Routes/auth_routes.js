const express = require("express");
const router = express.Router();
const LoginValidator = require("../Validations/LoginValidator");
const RegisterValidator = require("../Validations/RegisterValidator");
const {checkUser, loginUser} = require("../Controllers/UserController");
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
router.post("/login", authLimiter,logger, (req, res) => {
    // Validating the data from the form which is coming from the client
    const { errors, isValid } = LoginValidator(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }else{
        return loginUser({email:req.body.email , password: req.body.password}, res);
    }
});

router.post('/register', (req, res) => {
    const { errors, isValid } = RegisterValidator(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }else{
        return checkUser({name: req.body.name, email: req.body.email, password: req.body.password}, res);
    }
});

router.post('/logout',passport.authenticate('jwt', { session: false }), (req, res, next)=>{
    req.logout((err)=>{
      if (err) { 
        return next(err);
      }
      req.session.destroy(); // Destroy the session
      res.status(200).json({
          status: true,
          message: 'Successfully logged out',
          cookie: req.cookies,
          session:req.sessionID
      });
    });
  });

// router.get('/me', isAuthenticated, (req, res) => {
//     return res.status(200).json({status:true, user:req.user});
// })

router.get('/me', passport.authenticate('jwt', { session: false }),(req, res)=>{
        res.status(200).json({status:true, user:req.user});
    }
);

module.exports = router;