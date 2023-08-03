require('dotenv').config();
const passport = require("passport");
const User = require('../models/user.schema.model');
const bcrypt = require('bcrypt');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.use(
  new GoogleStrategy(
    {
      clientID: "260527722923-epik5gfetbbcgk5rkkdi3tnvtsck3t3u.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3300/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOne({ googleId: profile.id }, (err, user) => {
        if (err) return cb(err, null);

        // not a user; so create a new user with new google id
        if (!user) {
          let newUser = new User({
            googleId: profile.id,
            username: profile.displayName,
          });
          newUser.save();
          return cb(null, newUser);
        } else {
          // if we find an user just return return user
          return cb(null, user);
        }
      });
    }
  )
);


// create session id
// whenever we login it creates user id inside session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//find session info using session id
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
})