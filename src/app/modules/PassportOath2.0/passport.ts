import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel from "../user/user.model"; // Adjust path as needed
import config from "../../../config"; // Adjust path as needed
import { AuthServices } from "../Auth/auth.service";


// Serialize user for session persistence
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Configure Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID as string,
      clientSecret: config.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "http://localhost:5173/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        let user = await UserModel.findOne({ email });

        if (!user) {
          // If user doesn't exist, create a new user using AuthService
          user = await AuthServices.googleAuth({
            googleId: profile.id,
            name: profile.displayName,
            email: email,
            profilePicture: profile.photos?.[0].value,
          });
        }

        return done(null, user);
      } catch (err) {
        console.error("Error during OAuth callback:", err);
        return done(err);
      }
    }
  )
);

export default passport;
