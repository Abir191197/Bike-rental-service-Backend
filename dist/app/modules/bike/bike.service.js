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
exports.bikeService = void 0;
const bike_model_1 = __importDefault(require("./bike.model"));
const appError_1 = __importDefault(require("../../errors/appError"));
const http_status_1 = __importDefault(require("http-status"));
const createBikeIntoDB = (bikeData) => __awaiter(void 0, void 0, void 0, function* () {
    const bike = new bike_model_1.default(bikeData);
    yield bike.save();
    return bike.toObject();
});
const getAllBikeFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield bike_model_1.default.find();
        return result;
    }
    catch (error) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Failed to retrieved Bike");
    }
});
const updatedBikeIntoDB = (payload, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (payload !== null) {
            const updatedBike = yield bike_model_1.default.findOneAndUpdate({ id: payload.id }, { $set: updateData }, { new: true, runValidators: true });
            if (!updatedBike) {
                throw new appError_1.default(http_status_1.default.NOT_FOUND, "User not found");
            }
            return updatedBike;
        }
        else {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Invalid payload");
        }
    }
    catch (error) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Failed to update bike");
    }
});
const deleteBikeIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield bike_model_1.default.findByIdAndDelete(payload === null || payload === void 0 ? void 0 : payload.id);
        return result;
    }
    catch (error) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Failed to delete Bike");
    }
});
exports.bikeService = {
    createBikeIntoDB,
    getAllBikeFromDB,
    updatedBikeIntoDB,
    deleteBikeIntoDB,
};
