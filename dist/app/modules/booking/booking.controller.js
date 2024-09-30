"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const booking_service_1 = require("./booking.service");
const createBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = {
        rentalInformation: req.body,
        authUserInformation: req.user,
    };
    console.log(payload);
    const result = yield booking_service_1.BookingService.createBookingIntoDB(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Booking is created successfully",
        data: result,
    });
}));
//return Bike for admin route
const returnBike = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract ID from URL parameters and ReturnTime from the request body
    const { id } = req.params;
    const { returnTime } = req.body; // Ensure consistency in naming
    // Log for debugging
    console.log(`ID: ${id}`);
    console.log(`Return Time: ${returnTime}`);
    // Call the service to handle the bike return
    const result = yield booking_service_1.BookingService.returnBikeIntoDB(id, returnTime);
    // Send a successful response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Bike returned successfully",
        data: result,
    });
}));
//show user full rental data
const allBikeRentals = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const User = req.user;
    const result = yield booking_service_1.BookingService.showAllRentFromDB(User);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Rentals retrieved successfully",
        data: result,
    });
}));
const allBikeRentalsForAdminOnly = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_service_1.BookingService.showAllRentFromDBForAdmin();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Rentals retrieved successfully",
        data: result,
    });
}));
//Full Payment Controller
const FullPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(http_status_1.default.UNAUTHORIZED).send({
            success: false,
            message: "User not authenticated",
        });
    }
    const { TotalPayTran_id } = req.params; // Use `req.params` for URL params
    const user = req.user;
    try {
        const result = yield booking_service_1.BookingService.FullPaymentGetWay(TotalPayTran_id, user);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Payment Info retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.INTERNAL_SERVER_ERROR,
            success: false,
            message: "An error occurred",
        });
    }
}));
exports.BookingController = {
    createBooking,
    returnBike,
    allBikeRentals,
    allBikeRentalsForAdminOnly,
    FullPayment,
};
