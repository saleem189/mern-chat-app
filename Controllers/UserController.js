// Load User model
const User = require("../Models/User");

const bcrypt = require("bcryptjs");


const checkUser = ({email: email, password: password , name: name}, res) =>{
    User.findOne({email:email}).then(user => {
        if(user){
            return res.status(400).json({email: "Email already exists"});
        }else{
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
    });
}

const loginUser = ({email: email, password: password}, res) =>{
    User.findOne({email:email}).then(user => {
       (!user) ? res.status(400).json({emailnotfound: "Email does not exist"}) : comparePassword(password, user.password, user, res);
    });
}

const comparePassword = (password, hash, user, res) => {
    bcrypt.compare(password, hash).then(isMatch => {
        isMatch ? res.status(200).json({status:true, user:user}) : res.status(400).json({passwordincorrect: "Password incorrect"});
    });
}

module.exports = {checkUser, loginUser};