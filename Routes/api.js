const express = require("express");
const router = express.Router();
const LoginValidator = require("../Validations/LoginValidator");
const RegisterValidator = require("../Validations/RegisterValidator");
const {checkUser, loginUser} = require("../Controllers/UserController");

router.post("/login", (req, res) => {

    // Validating the data from the form which is coming from the client
    const { errors, isValid } = LoginValidator(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }else{
        // return res.status(200).json({success:true});
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
    // return res.status(200).json({success:true});
});

module.exports = router;