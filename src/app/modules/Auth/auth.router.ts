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
const googleAuth = async (user: { email: any }) => {
  const flowName = "GeneralOAuthFlow"; // Adding the flow name for tracing

  try {
    let existingUser = await UserModel.findOne({ email: user.email });
    if (!existingUser) {
      console.error(`User not found in ${flowName}`);
      throw new Error("User not found");
    }

    const jwtPayload = { email: existingUser.email, role: existingUser.role };
    const accessToken = generateAccessToken(jwtPayload);
    const refreshToken = generateRefreshToken(jwtPayload);

    return { existingUser, accessToken, refreshToken };
  } catch (error) {
    console.error(`Error in ${flowName}:`, error);
    throw error; // Re-throw to be caught in the route handler
  }
};


// Google OAuth callback route
router.get('/google/callback', async (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, user, info) => {
    const flowName = "GeneralOAuthFlow"; // Adding the flow name for tracing

    if (err || !user) {
      console.error(`Error in ${flowName}:`, err || "User not authenticated");
      return res.redirect('/login'); // Redirect to login on error
    }

    try {
      // Perform Google authentication
      const { accessToken, refreshToken } = await googleAuth(user);

      // Redirect to the frontend with the tokens
      const redirectUrl = `${config.callbackURL}?access_token=${accessToken}&refresh_token=${refreshToken}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error(`Error during ${flowName}:`, error);
      res.redirect('/login'); // Redirect to login on error
    }
  })(req, res, next);
});

export const AuthRoutes = router;
