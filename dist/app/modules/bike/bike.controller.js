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
exports.bikeController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const bike_service_1 = require("./bike.service");
const appError_1 = __importDefault(require("../../errors/appError"));
const createBike = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Directly use req.body, which should be the bike data
    const bikeData = req.body;
    const result = yield bike_service_1.bikeService.createBikeIntoDB(bikeData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Bike is created successfully",
        data: result,
    });
}));
const GetAllBike = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bike_service_1.bikeService.getAllBikeFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All bikes retrieved successfully",
        data: result,
    });
}));
const GetOneBike = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield bike_service_1.bikeService.getBikeById(id);
    if (!result) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.NOT_FOUND,
            success: false,
            message: "Bike not found",
        });
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Bike retrieved successfully",
        data: result,
    });
}));
const updatedBike = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure req.user is properly typed and authenticated
    if (!req.user) {
        throw new appError_1.default(http_status_1.default.UNAUTHORIZED, "User not authenticated");
    }
    // Extract the bike ID from the request parameters
    const id = req.params.id;
    // Extract the PerHour value from the request body
    const { PerHour } = req.body;
    // Validate the input
    if (typeof PerHour !== "number" || PerHour <= 0) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Invalid price per hour");
    }
    // Call the service function to update the bike in the database
    const result = yield bike_service_1.bikeService.updatedBikeIntoDB(id, { PerHour });
    // Send the response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Bike updated successfully",
        data: result,
    });
}));
const deleteBike = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bike_service_1.bikeService.deleteBikeIntoDB(req.params);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Bike deleted successfully",
    });
}));
exports.bikeController = {
    createBike,
    GetAllBike,
    updatedBike,
    deleteBike,
    GetOneBike,
};
