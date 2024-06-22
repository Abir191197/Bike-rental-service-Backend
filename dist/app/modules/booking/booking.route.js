"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_constant_1 = require("../user/user.constant");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const booking_controller_1 = require("./booking.controller");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(user_constant_1.USER_ROLE.admin), booking_controller_1.BookingController.createBooking);
router.put("/:id/return", (0, auth_1.default)(user_constant_1.USER_ROLE.admin), booking_controller_1.BookingController.returnBike);
router.get("/", (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user), booking_controller_1.BookingController.allBikeRentals);
exports.BookRoutes = router;
