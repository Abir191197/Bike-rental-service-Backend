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
exports.AuthControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auth_service_1 = require("./auth.service");
const config_1 = __importDefault(require("../../../config"));
const appError_1 = __importDefault(require("../../errors/appError"));
// Helper function to set authentication cookies
const setAuthCookies = (res, accessToken, refreshToken) => {
    res.cookie("refreshToken", refreshToken, {
        secure: config_1.default.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "strict",
    });
    res.cookie("accessToken", accessToken, {
        secure: config_1.default.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "strict",
    });
};
// SignIn function
const signIn = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthServices.signInUser(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User signed up successfully!",
        data: result,
    });
}));
// LogIn function
const logIn = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthServices.logInUser(req.body);
    const { accessToken, refreshToken } = result;
    // Set HttpOnly and Secure cookies for refreshToken and accessToken
    setAuthCookies(res, accessToken, refreshToken);
    // Filter user data to exclude sensitive information
    const userData = {
        _id: result.user._id,
        name: result.user.name,
        email: result.user.email,
        phone: result.user.phone,
        address: result.user.address,
        role: result.user.role,
    };
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User logged in successfully",
        token: accessToken,
        data: userData,
    });
}));
// RefreshToken function
const refreshAccessToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        throw new appError_1.default(http_status_1.default.UNAUTHORIZED, "Refresh token not provided");
    }
    const result = yield auth_service_1.AuthServices.refreshToken(refreshToken);
    // Set new access token in cookie
    res.cookie("accessToken", result.accessToken, {
        secure: config_1.default.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "strict",
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Access token refreshed successfully!",
        token: result.accessToken,
        data: null,
    });
}));
// Google OAuth callback
const google = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        // Redirect to the login page or any other appropriate action
        return res.redirect("/");
    }
    // Call AuthServices.googleAuth to get or create the user and generate tokens
    const { existingUser, accessToken, refreshToken } = yield auth_service_1.AuthServices.googleAuth(user);
    // Set cookies for access and refresh tokens
    setAuthCookies(res, accessToken, refreshToken);
    const userData = {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        phone: existingUser.phone,
        address: existingUser.address,
        role: existingUser.role,
    };
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User logged in successfully",
        token: accessToken,
        data: userData,
    });
}));
exports.AuthControllers = {
    signIn,
    logIn,
    refreshAccessToken,
    google,
};
