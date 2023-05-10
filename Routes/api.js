const express = require("express");
const router = express.Router();
const LoginValidator = require("../Validations/LoginValidator");

router.post("/login", (req, res) => {

    const { errors, isValid } = LoginValidator(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }else{
        return res.status(200).json({success:true});
    }
    // return res.status(404).json({ success: false, message: "Invalid Credentials" });
});

module.exports = router;