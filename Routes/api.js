const express = require("express");
const router = express.Router();
const LoginValidator = require("../Validations/LoginValidator");
const RegisterValidator = require("../Validations/RegisterValidator");
const {checkUser, loginUser} = require("../Controllers/UserController");
const authLimiter = require("../Middlewares/reate_limiter");

const logger = require("../Middlewares/auth_middleware");

/**
 * Auth Routes with Rate Limitter middleware
 */

/**
 * if you want to show error logger middeware then
 * router.post("/login", authLimiter, logger, (req, res) => {
 */
router.post("/login", authLimiter, (req, res) => {
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

module.exports = router;