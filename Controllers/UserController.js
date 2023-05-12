// Load User model
const User = require("../Models/User");
const jsonWebToken = require("jsonwebtoken");
const jsonWebTokenSecret = require("../configurations/keys").jsonWebTokenSecret;
const bcrypt = require("bcryptjs");


const checkUser = ({email: email, password: password , name: name}, res) =>{
    User.findOne({email:email}).then(user => {
        (user) ? res.status(400).json({email: "Email already exists"}) : createUser({name: name, email: email, password: password}, res);
    });
}

const loginUser = ({email: email, password: password}, res) =>{
    User.findOne({email:email}).then(user => {
       (!user) ? res.status(400).json({emailnotfound: "Email does not exist"}) : comparePassword(password, user.password, user, res);
    });
}

const comparePassword = (password, hash, user, res) => {
    bcrypt.compare(password, hash).then(isMatch => {
        isMatch ? generateJsonWebToken({user_id: user._id, user_name: user.name}, res) : res.status(400).json({passwordincorrect: "Password incorrect"});
    });
}

const createUser = ({name: name, email: email, password: password}, res) =>{
    const newUser = new User({
        name: name,
        email: email,
        password: password
       });

       // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
                .save()
                .then(user => res.status(201).json({status:true, user:user}))
                .catch(err => res.status(500).json(err));
            });
        });
}

const generateJsonWebToken = ({user_id, user_name}, res) => {
    const payload = {
        id: user_id,
        name: user_name,
    }
    jsonWebToken.sign(payload ,jsonWebTokenSecret,{ expiresIn: '1h' }, (err, token) => {
        (err) ? res.status(500).json({err: err}) : res.status(200).json({
            status:true,
            token: "Bearer " + token
        });
    })
}

module.exports = {checkUser, loginUser};