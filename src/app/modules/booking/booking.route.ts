import express from "express";
import { USER_ROLE } from "../user/user.constant";
import auth from "../../middlewares/auth";

import { BookingController } from "./booking.controller";

const router = express.Router();

router.post("/", auth(USER_ROLE.admin,USER_ROLE.user), BookingController.createBooking);

router.put("/:id/return", auth(USER_ROLE.admin), BookingController.returnBike);

router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.user),
  BookingController.allBikeRentals,
);

router.get(
  "/AllRentals",
  auth(USER_ROLE.admin), 
  BookingController.allBikeRentalsForAdminOnly
);


router.post(
  "/TotalPayment/:TotalPayTran_id",
  auth(USER_ROLE.admin, USER_ROLE.user),
  BookingController.FullPayment
);



export const BookRoutes = router;
