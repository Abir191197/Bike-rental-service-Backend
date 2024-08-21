"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config")); // Adjust the path to your config file
// Generate Access Token
const generateAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, config_1.default.jwt_access_secret, {
        expiresIn: "10d", // Customize as needed
    });
};
exports.generateAccessToken = generateAccessToken;
// Generate Refresh Token
const generateRefreshToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, config_1.default.jwt_access_secret, {
        expiresIn: "30d", // Customize as needed
    });
};
exports.generateRefreshToken = generateRefreshToken;
// Verify Token
const verifyToken = (token, secret) => {
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.verifyToken = verifyToken;
