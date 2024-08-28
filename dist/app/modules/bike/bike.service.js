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
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const createBikeIntoDB = (bikeData) => __awaiter(void 0, void 0, void 0, function* () {
    const bike = new bike_model_1.default(bikeData);
    yield bike.save();
    return bike.toObject();
});
const BikeSearchableFields = ["fullbike_name"]; // Adjust fields as necessary
const getAllBikeFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryObj = Object.assign({}, query);
        // Ensure the query excludes deleted bikes
        queryObj.isDelete = false;
        const bikeQuery = new QueryBuilder_1.default(bike_model_1.default.find(), queryObj)
            .search(BikeSearchableFields)
            .filter() // Implement filtering based on your needs
            .paginate() // Implement pagination based on your needs
            .sort() // Implement sorting based on your needs
            .fields(); // Implement field selection if needed
        const result = yield bikeQuery.modelQuery;
        return result;
    }
    catch (error) {
        // Handle errors
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Failed to retrieve bikes");
    }
});
//get one bike
const getBikeById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield bike_model_1.default.findById(id);
        if (!result) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, "Bike not found");
        }
        return result;
    }
    catch (error) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Failed to retrieve Bike");
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
        // Ensure payload and payload.id are valid
        if (!(payload === null || payload === void 0 ? void 0 : payload.id)) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Bike ID is required");
        }
        // Perform the soft delete by setting isDeleted to true
        const result = yield bike_model_1.default.findByIdAndUpdate(payload.id, { isDeleted: true }, { new: true } // Return the updated document
        );
        if (!result) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, "Bike not found");
        }
        return result;
    }
    catch (error) {
        // Handle and throw an appropriate error
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Failed to delete Bike");
    }
});
exports.bikeService = {
    createBikeIntoDB,
    getAllBikeFromDB,
    updatedBikeIntoDB,
    deleteBikeIntoDB,
    getBikeById,
};
