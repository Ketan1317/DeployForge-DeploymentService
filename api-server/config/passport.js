const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/User");

const configurePassport = () => {
  // ==================== GITHUB OAUTH ====================
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ githubId: profile.id });

          if (!user) {
            user = new User({
              githubId: profile.id,
              username: profile.username,
              email: profile.emails?.[0]?.value,
              avatar: profile.photos?.[0]?.value,
              profile: profile._json,
            });
            await user.save();
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // ==================== JWT STRATEGY ====================
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (jwtPayload, done) => {
        try {
          const user = await User.findById(jwtPayload.userId);
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // ==================== SERIALIZATION ====================
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  console.log("✓ Passport Configured");
};

module.exports = configurePassport;
