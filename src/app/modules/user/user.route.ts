import express from "express";

import { userControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";

const router = express.Router();


router.get(
  "/me",
  auth(USER_ROLE.admin, USER_ROLE.user),
  userControllers.findUser,
);
router.put(
  "/me",
  auth(USER_ROLE.admin, USER_ROLE.user),
  userControllers.updatedUser,
);
export const UserRoutes = router;
