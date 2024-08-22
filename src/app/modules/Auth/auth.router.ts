import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";
import { AuthControllers } from "./auth.controller";
import { UserValidation } from "../user/user.validation";
import passport from "../PassportOath2.0/passport";
import jwt, { JwtPayload } from "jsonwebtoken";
import UserModel from "../user/user.model";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";
import config from "../../../config";
const router = express.Router();

router.post(
  "/signup",
  validateRequest(UserValidation.userValidationSchema),
  AuthControllers.signIn,
);

router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.logIn,
);

router.post(
  "/refresh-token",
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshAccessToken,
);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Function to generate tokens


// Function to find or create a user
const googleAuth = async (user: { email: any; }) => {
  let existingUser = await UserModel.findOne({ email: user.email });
  if (!existingUser) {
    // Handle user creation or other logic as needed
    throw new Error("User not found");
  }

  // Generate tokens
  const jwtPayload = { email: existingUser.email, role: existingUser.role };
  const accessToken = generateAccessToken(jwtPayload);
  const refreshToken = generateRefreshToken(jwtPayload);

  return { existingUser, accessToken, refreshToken };
};

// Google OAuth callback route
router.get('/google/callback', async (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, user, info) => {
    if (err || !user) {
      return res.redirect('/login'); // Redirect to login on error
    }

    try {
      // Perform Google authentication
      const { accessToken, refreshToken } = await googleAuth(user);

      // Redirect with token
      res.redirect(
        config.Google_Redirect_Url as string
      );
    } catch (error) {
      console.error('Error during authentication:', error);
      res.redirect('/login'); // Redirect to login on error
    }
  })(req, res, next);
});
export const AuthRoutes = router;
