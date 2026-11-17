import passport from 'passport';
import { Strategy as GitHubStrategy, Profile as GitHubProfile } from 'passport-github2';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User';
import { IUserDocument, JwtPayload } from '../types';

interface ExtendedGitHubProfile extends GitHubProfile {
  _json?: {
    login?: string;
    [key: string]: unknown;
  };
}

const configurePassport = (): void => {
  // GITHUB OAUTH
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID || '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
        callbackURL: process.env.GITHUB_CALLBACK_URL || '',
      },
      async (
        accessToken: string,
        _refreshToken: string,
        profile: ExtendedGitHubProfile,
        done: (error: unknown, user?: IUserDocument | false) => void
      ) => {
        try {
          let user = await User.findOne({ githubId: profile.id });

          if (!user) {
            user = new User({
              githubId: profile.id,
              username: profile.username || profile._json?.login || `user-${profile.id}`,
              email: profile.emails?.[0]?.value,
              avatar: profile.photos?.[0]?.value,
              profile: profile._json,
              githubAccessToken: accessToken,
            });
            await user.save();
          } else {
            user.githubAccessToken = accessToken;
            if (!user.username) {
              user.username = profile.username || profile._json?.login || `user-${profile.id}`;
            }
            await user.save();
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET || '',
      },
      async (
        jwtPayload: JwtPayload,
        done: (error: unknown, user?: IUserDocument | false) => void
      ) => {
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

  passport.serializeUser((user: Express.User, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  console.log(' Passport Configured');
};

export default configurePassport;
