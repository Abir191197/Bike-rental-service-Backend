import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel from "../user/user.model"; // Adjust path as needed
import config from "../../../config"; // Adjust path as needed

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
      clientSecret: config.GOOGLE_CLIENT_SECRET as string, // Removed extra space
      callbackURL: "http://localhost:3000/api/auth/google/callback", // Ensure this matches your Google Developer Console
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find user by Google ID or create a new user
        let user = await UserModel.findOne({ googleId: profile.id });

        if (!user) {
          user = await UserModel.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0].value,
            profilePicture: profile._json.picture, // Optional: Save profile picture
            role: "user", // Assign a default role
          });
        }

        return done(null, user);
      } catch (err) {
        console.error("Error during OAuth callback:", err); // Log error for debugging
        return done(err);
      }
    },
  ),
);

export default passport;
