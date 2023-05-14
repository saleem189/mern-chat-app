const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const { JWT_SECRET_KEY } = require("./constants");
const User = mongoose.model("users");

// Options for the JWT authentication strategy
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = JWT_SECRET_KEY;

/**
 * Configures passport to use JWT authentication strategy
 * @param {object} passport - Passport object to configure
 */
module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );

  // Serialize user object
  passport.serializeUser((userObj, done) => {
    done(null, userObj)
  });

  // Deserialize user object
  passport.deserializeUser((userObj, done) => {
    done(null, userObj)
  });
};
