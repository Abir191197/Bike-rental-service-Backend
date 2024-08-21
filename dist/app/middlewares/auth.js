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
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const appError_1 = __importDefault(require("../errors/appError"));
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
            throw new appError_1.default(http_status_1.default.UNAUTHORIZED, "Authorization token missing or malformed");
        }
        const token = authorizationHeader.split(" ")[1];
        if (!token) {
            throw new appError_1.default(http_status_1.default.UNAUTHORIZED, "Token not provided");
        }
        try {
            // Verify token
            const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
            // Assign decoded payload to request object
            req.user = decoded;
            // Role checking
            const role = decoded.role;
            if (requiredRoles.length === 0 || requiredRoles.includes(role)) {
                return next();
            }
            // Unauthorized if user's role doesn't match required roles
            throw new appError_1.default(http_status_1.default.FORBIDDEN, "You do not have permission to access this resource");
        }
        catch (error) {
            if (error === "TokenExpiredError") {
                throw new appError_1.default(http_status_1.default.UNAUTHORIZED, "Token has expired, please log in again");
            }
            // Handle other token verification errors
            throw new appError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid or expired token");
        }
    }));
};
exports.default = auth;
