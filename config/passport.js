
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const validatePass = require('./passwordUtils').validatePass



let verfiyCallback = (username, password, done) => {

  User.findOne({ username: username }, (err, user) => {
    if (err) {
      return done(err);
    };
    if (!user) {
      return done(null, false, { msg: "Incorrect username" });
    }

    let isValid = validatePass(password,user.hash,user.salt)

    if (isValid) {
      return done(null, user);
    }else{
      return done(null,false, { msg: "Incorrect password" })
    }
  })
  .catch(err=>done(err))
}

let strategy = new LocalStrategy(verfiyCallback)

passport.use(strategy)

passport.serializeUser((user, done)=>{
    done(null, user._id);
  });
  
passport.deserializeUser((id, done)=>{
    User.findById({_id:id}, function(err, user) {
      done(err, user);
    })
  })
