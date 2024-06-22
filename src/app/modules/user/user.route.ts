import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { userControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";

const router = express.Router();

router.post(
  "/signIn",
  auth(USER_ROLE.admin),
  validateRequest(UserValidation.userValidationSchema),
  userControllers.createUser
);
router.get(
  "/me",
  auth(USER_ROLE.admin, USER_ROLE.user),
  userControllers.findUser
);
router.put(
  "/me",
  auth(USER_ROLE.admin, USER_ROLE.user),
  userControllers.updatedUser
);
export const UserRoutes = router;
