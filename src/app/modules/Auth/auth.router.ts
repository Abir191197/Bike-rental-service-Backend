import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";
import { AuthControllers } from "./auth.controller";
import { UserValidation } from "../user/user.validation";

const router = express.Router();

router.post(
  "/signup",
  validateRequest(UserValidation.userValidationSchema),
  AuthControllers.signIn
);

router.post('/login', validateRequest(AuthValidation.loginValidationSchema), AuthControllers.logIn)


router.post(
  "/refresh-token",
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshAccessToken
);


export const AuthRoutes = router;