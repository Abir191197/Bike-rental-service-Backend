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
exports.userControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const user_service_1 = require("./user.service");
// Controller to handle creating a new user
const createUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_service_1.UserService.createUserIntoDB(req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.CREATED,
            success: true,
            message: "User is created successfully",
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Failed to create user",
            data: null,
        });
    }
}));
// Controller to handle retrieving a user profile
const findUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        // Handle case where req.user is undefined
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.UNAUTHORIZED,
            success: false,
            message: "User not authenticated",
            data: null,
        });
    }
    try {
        const result = yield user_service_1.UserService.findUserFromDB(req.user);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "User profile retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Failed to retrieve user profile",
            data: null,
        });
    }
}));
// Controller to handle updating a user profile
const updatedUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        // Handle case where req.user is undefined
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.UNAUTHORIZED,
            success: false,
            message: "User not authenticated",
            data: null,
        });
    }
    try {
        const result = yield user_service_1.UserService.updatedUserIntoDB(req.user, req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Profile updated successfully",
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Failed to update profile",
            data: null,
        });
    }
}));
exports.userControllers = {
    createUser,
    findUser,
    updatedUser,
};
