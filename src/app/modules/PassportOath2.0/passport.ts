import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "../../../config"; // Adjust path as needed
import UserModel from "../user/user.model"; // Adjust path as needed

// Serialize user for session persistence
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
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
      callbackURL:
        "https://bike-rental-service-backend-two.vercel.app/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        let user = await UserModel.findOne({ email });
        if (!user) {
          // Handle user creation or other logic
          return done(new Error("User not found"));
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
