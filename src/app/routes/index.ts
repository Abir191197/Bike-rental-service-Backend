import express from "express";

import { AuthRoutes } from "../modules/Auth/auth.router";
import { UserRoutes } from "../modules/user/user.route";
import { BikeRoutes } from "../modules/bike/bike.route";
import { BookRoutes } from "../modules/booking/booking.route";

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
    path: "/bikes",
    route: BikeRoutes,
  },
  {
    path: "/rentals",
    route: BookRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
