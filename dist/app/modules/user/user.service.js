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
exports.UserService = void 0;
const appError_1 = __importDefault(require("../../errors/appError"));
const user_model_1 = __importDefault(require("./user.model"));
const http_status_1 = __importDefault(require("http-status"));
const findUserFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (payload !== null) {
            const result = yield user_model_1.default.findOne({
                email: payload.email,
            }).select("-password");
            return result;
        }
    }
    catch (error) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Failed to Get User");
    }
});
const updatedUserIntoDB = (payload, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (payload !== null) {
            const updatedUser = yield user_model_1.default.findOneAndUpdate({ email: payload.email }, { $set: updateData }, { new: true, runValidators: true }).select("-password"); // Exclude the password field from the result
            if (!updatedUser) {
                throw new appError_1.default(http_status_1.default.NOT_FOUND, "User not found");
            }
            return updatedUser;
        }
        else {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Invalid payload");
        }
    }
    catch (error) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Failed to update user");
    }
});
const addFollowingToUser = (payload, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (payload !== null) {
            const updatedUser = yield user_model_1.default.findOneAndUpdate({ email: payload.email }, { $addToSet: { following: updateData.following } }, { new: true, runValidators: true }).select("-password");
            if (!updatedUser) {
                throw new appError_1.default(http_status_1.default.NOT_FOUND, "User not found");
            }
            return updatedUser;
        }
        else {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Invalid payload");
        }
    }
    catch (error) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Failed to add following to user");
    }
});
const getMyFollowers = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (payload !== null) {
            const user = yield user_model_1.default.findOne({ email: payload.email }).select("followers");
            if (!user) {
                throw new appError_1.default(http_status_1.default.NOT_FOUND, "User not found");
            }
            return user.followers;
        }
        else {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Invalid payload");
        }
    }
    catch (error) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Failed to get followers");
    }
});
exports.UserService = {
    findUserFromDB,
    updatedUserIntoDB,
    addFollowingToUser,
    getMyFollowers,
};
