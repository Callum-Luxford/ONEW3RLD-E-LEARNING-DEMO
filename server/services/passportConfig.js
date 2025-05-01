// Modules
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET;

// Local Strategy - for email/password login
passport.use(
  new LocalStrategy(
    { usernameField: "email" }, // passport to use 'email' instead of defualt
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false, { message: "Incorrect email." });

        const isMatch = await user.comparePassword(password);
        console.log("Attempting login for:", email);
        console.log("User found:", user);
        console.log("Password isMatch:", await user.comparePassword(password));

        if (!isMatch)
          return done(null, false, { message: "Incorrect password." });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// JWT Strategy - for protecting routes using token
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    ExtractJwt.fromExtractors([(req) => req?.cookies?.token]),
  ]),
  secretOrKey: JWT_SECRET,
};

passport.use(
  new JWTStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findById(payload.id);
      if (!user) return done(null, false);

      return done(null, user);
    } catch (error) {
      return done(err, false);
    }
  })
);

module.exports = passport;
