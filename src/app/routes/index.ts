import express from "express";

import { AuthRoutes } from "../modules/Auth/auth.router";
import { UserRoutes } from "../modules/user/user.route";


import { PetPostRoutes } from "../modules/Pet Post/post.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/pet",
    route: PetPostRoutes,
  },
  // {
  //   path: "/payment",
  //   route: PaymentRoutes,
  // },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
