"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_router_1 = require("../modules/Auth/auth.router");
const user_route_1 = require("../modules/user/user.route");
const bike_route_1 = require("../modules/bike/bike.route");
const booking_route_1 = require("../modules/booking/booking.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_router_1.AuthRoutes,
    },
    {
        path: "/users",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/bikes",
        route: bike_route_1.BikeRoutes,
    },
    {
        path: "/rentals",
        route: booking_route_1.BookRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
