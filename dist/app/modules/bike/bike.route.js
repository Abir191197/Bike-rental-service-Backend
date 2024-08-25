"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BikeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const bike_validation_1 = require("./bike.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_constant_1 = require("../user/user.constant");
const bike_controller_1 = require("./bike.controller");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(bike_validation_1.BikeValidation.bikeValidationSchema), bike_controller_1.bikeController.createBike);
router.get("/", (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user), bike_controller_1.bikeController.GetAllBike);
router.get("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user), bike_controller_1.bikeController.GetOneBike);
router.put("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.admin), bike_controller_1.bikeController.updatedBike);
router.delete("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.admin), bike_controller_1.bikeController.deleteBike);
exports.BikeRoutes = router;
