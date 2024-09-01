import express from "express";
import { BikeValidation } from "./bike.validation";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE } from "../user/user.constant";
import { bikeController } from "./bike.controller";

const router = express.Router();

router.post("/",
  auth(USER_ROLE.admin),
  //validateRequest(BikeValidation.bikeValidationSchema),
  bikeController.createBike,
);

router.get("/", auth(USER_ROLE.admin, USER_ROLE.user), bikeController.GetAllBike);

router.get("/FeatureBike", bikeController.GetFeatureBike);




router.get(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.user),
  bikeController.GetOneBike
);

router.put("/:id", auth(USER_ROLE.admin), bikeController.updatedBike);

router.delete("/:id", auth(USER_ROLE.admin), bikeController.deleteBike);
export const BikeRoutes = router;
