import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";
import { AuthControllers } from "./auth.controller";
import { UserValidation } from "../user/user.validation";

const router = express.Router();

router.post(
  "/signup",
  validateRequest(UserValidation.userValidationSchema),
  AuthControllers.SignIn
);

router.post('/login', validateRequest(AuthValidation.loginValidationSchema), AuthControllers.LogIn)
router.post('/LogIn', validateRequest(AuthValidation.loginValidationSchema), AuthControllers.LogIn)

router.post(
  "/refresh-token",
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken
);


export const AuthRoutes = router;