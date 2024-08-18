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
exports.BookingService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../errors/appError"));
const bike_model_1 = __importDefault(require("../bike/bike.model"));
const user_model_1 = __importDefault(require("../user/user.model"));
const booking_model_1 = __importDefault(require("./booking.model"));
const createBookingIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { authUserInformation, rentalInformation } = payload;
    // Check if the user exists
    const isUserExist = yield user_model_1.default.findOne({
        email: authUserInformation.email,
    });
    if (!isUserExist) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    // Check if the bike exists and is available
    const isBikeExist = yield bike_model_1.default.findOne({
        _id: rentalInformation.bikeId,
    });
    if (!isBikeExist || !isBikeExist.isAvailable) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Bike not available");
    }
    const userId = isUserExist._id;
    const bikeId = isBikeExist._id;
    const newBookingInformation = {
        userId,
        bikeId,
        startTime: rentalInformation.startTime,
        totalCost: 0,
        isReturned: false,
    };
    // Update bike availability
    // updating bike isAvailable status to false
    yield bike_model_1.default.findByIdAndUpdate(bikeId, { isAvailable: false }, {
        new: true,
        runValidators: true,
    });
    // Create the booking
    const result = yield booking_model_1.default.create(newBookingInformation);
    return result;
});
//return bike for admin route
const returnBikeIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isBookingExists = yield booking_model_1.default.findOne({
        _id: id,
    });
    if (!isBookingExists) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Booking not available");
    }
    const findBikeModelID = isBookingExists.bikeId;
    const bikeId = yield bike_model_1.default.findById({
        _id: findBikeModelID,
    });
    const timePer = bikeId === null || bikeId === void 0 ? void 0 : bikeId.pricePerHour;
    const StartTime = isBookingExists === null || isBookingExists === void 0 ? void 0 : isBookingExists.startTime;
    const returnTime = new Date();
    const totalTime = (returnTime - StartTime) / (1000 * 60 * 60);
    const totalCost = Math.round(totalTime * timePer);
    // updated bike available
    yield bike_model_1.default.findByIdAndUpdate(findBikeModelID, { isAvailable: true }, {
        new: true,
        runValidators: true,
    });
    //updated booking model
    yield booking_model_1.default.findByIdAndUpdate(isBookingExists, { returnTime: new Date(), totalCost: totalCost, isReturned: true }, {
        new: true,
        runValidators: true,
    });
});
const showAllRentFromDB = (User) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.default.findOne({
        email: User.email,
    });
    const userId = isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist._id;
    //find booking model that user booking exist or not
    const isBookingExists = yield booking_model_1.default.find({
        userId: userId,
    });
    return isBookingExists;
});
exports.BookingService = {
    createBookingIntoDB,
    returnBikeIntoDB,
    showAllRentFromDB,
};
