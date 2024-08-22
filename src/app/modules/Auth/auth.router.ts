import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";
import { AuthControllers } from "./auth.controller";
import { UserValidation } from "../user/user.validation";
import passport from "../PassportOath2.0/passport";
import UserModel from "../user/user.model";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";
const router = express.Router();

// Sign up route
router.post(
  "/signup",
  validateRequest(UserValidation.userValidationSchema),
  AuthControllers.signIn
);

// Log in route
router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.logIn
);

// Refresh token route
router.post(
  "/refresh-token",
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshAccessToken
);

// Google OAuth route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Function to find or create a user
const googleAuth = async (user: { email: string }) => {
  let existingUser = await UserModel.findOne({ email: user.email });
  if (!existingUser) {
    // Optionally handle user creation here if desired
    throw new Error("User not found");
  }

  // Generate tokens
  const jwtPayload = { email: existingUser.email, role: existingUser.role };
  const accessToken = generateAccessToken(jwtPayload);
  const refreshToken = generateRefreshToken(jwtPayload);

  return { existingUser, accessToken, refreshToken };
};

// Google OAuth callback route
router.get("/google/callback", async (req, res, next) => {
  passport.authenticate(
    "google",
    { session: false },
    async (err, user, info) => {
      if (err || !user) {
        console.error("Authentication error:", err || "User not authenticated");
        return res.redirect("/login"); // Redirect to login on error
      }

      try {
        // Perform Google authentication
        const { accessToken, refreshToken } = await googleAuth(user);

        // Redirect with token
        const frontendUrl =
          "https://cox-s-sea-side-bike-frontend.vercel.app/Login";
        res.redirect(
          `${frontendUrl}?access_token=${accessToken}&refresh_token=${refreshToken}`
        );
      } catch (error) {
        console.error("Error during authentication:", error);
        res.redirect("/login"); // Redirect to login on error
      }
    }
  )(req, res, next);
});

export const AuthRoutes = router;
