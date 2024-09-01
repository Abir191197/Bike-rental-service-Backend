import express from "express";

import { AuthRoutes } from "../modules/Auth/auth.router";
import { UserRoutes } from "../modules/user/user.route";
import { BikeRoutes } from "../modules/bike/bike.route";
import { BookRoutes } from "../modules/booking/booking.route";
import { PaymentRoutes } from "../modules/Payment/payment.route";

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
  {
    path: "/payment",
    route: PaymentRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
