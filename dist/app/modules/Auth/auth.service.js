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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = __importDefault(require("../user/user.model"));
const appError_1 = __importDefault(require("../../errors/appError"));
const jwt_1 = require("../../utils/jwt");
const config_1 = __importDefault(require("../../../config"));
const getNextGoogleId = () => __awaiter(void 0, void 0, void 0, function* () {
    const maxUser = yield user_model_1.default.findOne({}, { googleId: 1 })
        .sort({ googleId: -1 })
        .exec();
    if (!maxUser || maxUser.googleId === null) {
        return 1; // Start from 1 if no users exist or if all `googleId`s are null
    }
    return maxUser.googleId + 1; // Increment the highest value
});
// SignInUser function
const signInUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt_1.default.hash(payload.password, 10);
    payload.password = hashedPassword;
    // Generate new googleId by incrementing the highest existing googleId
    const newGoogleId = yield getNextGoogleId();
    payload.googleId = String(newGoogleId);
    const result = yield user_model_1.default.create(payload);
    const _a = result.toObject(), { password } = _a, userWithoutSensitiveFields = __rest(_a, ["password"]);
    return userWithoutSensitiveFields;
});
// LogInUser function
const logInUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Checking if the user exists
    const user = yield user_model_1.default.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email }).select("+password");
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "This user is not found!");
    }
    const isMatch = yield bcrypt_1.default.compare(payload === null || payload === void 0 ? void 0 : payload.password, user.password);
    if (!isMatch) {
        throw new appError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid credentials!");
    }
    // Generate tokens
    const jwtPayload = { email: user.email, role: user.role };
    const accessToken = (0, jwt_1.generateAccessToken)(jwtPayload);
    const refreshToken = (0, jwt_1.generateRefreshToken)(jwtPayload);
    return { user, accessToken, refreshToken };
});
// RefreshToken function
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = (0, jwt_1.verifyToken)(token, config_1.default.jwt_access_secret);
    const { email, role } = decoded;
    const jwtPayload = { email, role };
    const newAccessToken = (0, jwt_1.generateAccessToken)(jwtPayload);
    return { accessToken: newAccessToken };
});
// GoogleAuth function
const googleAuth = (user) => __awaiter(void 0, void 0, void 0, function* () {
    let existingUser = yield user_model_1.default.findOne({ email: user.email });
    if (!existingUser) {
        throw new Error("User not found");
    }
    // Generate tokens
    const jwtPayload = { email: existingUser.email, role: existingUser.role };
    const accessToken = (0, jwt_1.generateAccessToken)(jwtPayload);
    const refreshToken = (0, jwt_1.generateRefreshToken)(jwtPayload);
    return { existingUser, accessToken, refreshToken };
});
exports.AuthServices = {
    signInUser,
    logInUser,
    refreshToken,
    googleAuth,
};
