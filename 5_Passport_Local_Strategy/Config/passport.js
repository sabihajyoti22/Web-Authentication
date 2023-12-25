const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")
const User = require("../Model/user.model")

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
      const user = await User.findOne({ username: username})
      if(!user)
        return done(null,false, {message: "Username is incorrect"})
      if(!bcrypt.compare(password, user.password)){
        return done(null,false, {message: "Password is incorrect"}) 
      }
      return done(null, user);
      } catch (error) {
        return done(error)
      }
  }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  // find session info using session id
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  });