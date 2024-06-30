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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../../config")); // Assuming you have a configuration file
// SignInUser function
const signInUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt_1.default.hash(payload.password, 10);
    payload.password = hashedPassword;
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
    // Creating a JWT token upon successful login
    const jwtPayload = {
        email: user.email,
        role: user.role, // Assuming user has a role attribute
    };
    const accessToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_access_secret, {
        expiresIn: "10d",
    });
    const refreshToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_access_secret, {
        expiresIn: "30d",
    });
    return { user, accessToken, refreshToken }; // Return the user, access token, and refresh token
});
// RefreshToken function
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
    const { email, role } = decoded;
    const jwtPayload = {
        email,
        role,
    };
    const newAccessToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_access_secret, {
        expiresIn: "10d",
    });
    return {
        accessToken: newAccessToken,
    };
});
// Exporting AuthServices
exports.AuthServices = {
    signInUser,
    logInUser,
    refreshToken,
};
// import httpStatus from "http-status";
// import UserModel from "../user/user.model";
// import { TLoginUser } from "./auth.interface";
// import AppError from "../../errors/appError";
// import { TUser } from "../user/user.interface";
// import jwt from "jsonwebtoken";
// import config from "../../../config/index"; // Assuming you have a configuration file
// import { JwtPayload } from "jsonwebtoken";
// const signInUser = async (payload: TUser) => {
//   const result = await UserModel.create(payload);
//     const {
//       password,
//       ...userWithoutSensitiveFields
//     } = result.toObject();
//   return userWithoutSensitiveFields;
// };
// //login start from here
// const LogInUser = async (payload: TLoginUser) => {
//   // checking if the user exists
//   const user = await UserModel.findOne({ email: payload?.email }).select(
//     "-password"
//   );
//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, "This user is not found!");
//   }
//   // Assuming you want to create a JWT token upon successful login
//   const jwtPayload: JwtPayload = {
//     email: user.email,
//     role: user.role, // Assuming user has a role attribute
//   };
//   const accessToken = jwt.sign(
//     jwtPayload,
//     config.jwt_access_secret as string,
//     { expiresIn: "10d" } // Corrected expiresIn format
//   );
//   return { user, accessToken }; // Return the user and the access token
// };
// const refreshToken = async (token: string) => {
//   const decoded = jwt.verify(
//     token,
//     config.jwt_access_secret as string
//   ) as JwtPayload;
//  const { email, role } = decoded;
//   const jwtPayload = {
//     email: email,
//     role:  role,
//   };
//   const accessToken = jwt.sign(
//     jwtPayload,
//     config.jwt_access_secret as string,
//     { expiresIn: "10d" } // Corrected expiresIn format
//   );
// return {
//   accessToken,
// };
// }
// export const AuthServices = {
//   signInUser,
//   LogInUser,
//   refreshToken,
// };
