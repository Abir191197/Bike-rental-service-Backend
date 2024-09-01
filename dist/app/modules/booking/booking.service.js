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
const payment_utils_1 = require("../Payment/payment.utils");
const mongoose_1 = __importDefault(require("mongoose"));
const TotalPaymentUtils_1 = require("../Payment/TotalPaymentUtils");
const luxon_1 = require("luxon");
const createBookingIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { authUserInformation, rentalInformation } = payload;
        // Check if the user exists
        const isUserExist = yield user_model_1.default.findOne({
            email: authUserInformation.email,
        }).session(session);
        if (!isUserExist) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, "User not found");
        }
        // Check if the bike exists and is available
        const isBikeExist = yield bike_model_1.default.findById({
            _id: rentalInformation.bikeId,
        }).session(session);
        if (!isBikeExist || isBikeExist.isAvailable === false) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, "Bike not available");
        }
        const userId = isUserExist._id;
        const bikeId = isBikeExist._id;
        const UserData = isUserExist;
        // Generate a random booking ID
        const bookingId = `BOOKING-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        // Generate a random booking ID
        const TotalPayTran_id = `BOOKING-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        // Prepare payment data
        const paymentData = {
            bookingId,
            UserData,
        };
        // Create booking information (not saved yet)
        const newBookingInformation = {
            bookingId,
            TotalPayTran_id, // Include the booking ID
            userId,
            bikeId,
            startTime: rentalInformation.startTime,
            totalCost: 0,
            isReturned: false,
        };
        // Update bike availability
        yield bike_model_1.default.findByIdAndUpdate(bikeId, { isAvailable: false }, {
            new: true,
            runValidators: true,
            session, // Ensure operation is part of the transaction
        });
        // Create the booking
        yield booking_model_1.default.create([newBookingInformation], { session });
        // Initiate payment session
        let paymentSession;
        try {
            paymentSession = yield (0, payment_utils_1.sendPaymentRequest)(paymentData);
        }
        catch (error) {
            console.error("Failed to create payment session:", error);
            yield session.abortTransaction(); // Rollback transaction
            throw new Error("Failed to initiate payment session.");
        }
        // Commit the transaction
        yield session.commitTransaction();
        session.endSession();
        // Return the payment session to the frontend
        return paymentSession;
    }
    catch (error) {
        yield session.abortTransaction(); // Rollback transaction on any failure
        session.endSession();
        throw error; // Re-throw the error to be handled by the calling function
    }
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
    const timePer = bikeId === null || bikeId === void 0 ? void 0 : bikeId.PerHour;
    const StartTime = isBookingExists === null || isBookingExists === void 0 ? void 0 : isBookingExists.startTime;
    console.log(StartTime);
    const returnTime = luxon_1.DateTime.now().setZone("Asia/Dhaka");
    console.log(returnTime);
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
    try {
        // Find the user by email
        const isUserExist = yield user_model_1.default.findOne({ email: User.email });
        if (!isUserExist) {
            throw new Error("User not found");
        }
        const userId = isUserExist._id;
        // Find bookings for the user and populate bike details
        const bookings = yield booking_model_1.default.find({ userId }).populate({
            path: "bikeId", // Path to the bikeId field in the BookingModel
            select: "fullbike_name PerHour imgSrc bikeId", // Select fields from the BikeModel
        });
        // Filter bookings to exclude those with failed advance payment
        const filteredBookings = bookings.filter((booking) => booking.advancePayment !== "Failed");
        return {
            bookings: filteredBookings,
        };
    }
    catch (error) {
        console.error("Error fetching rentals:", error);
        throw error;
    }
});
const showAllRentFromDBForAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield booking_model_1.default.find().populate([
            {
                path: "bikeId", // Path to the bikeId field in the BookingModel
                select: "fullbike_name PerHour imgSrc bikeId", // Select fields from the BikeModel
            },
            {
                path: "userId", // Path to the UserId field in the BookingModel
                select: "name phone", // Select fields from the UserModel
            },
        ]);
        return result;
    }
    catch (error) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Failed to retrieve rentals");
    }
});
//full payment URL link get Way
const FullPaymentGetWay = (TotalPayTran_id, user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find the user by email
        const isUserExist = yield user_model_1.default.findOne({ email: user.email });
        if (!isUserExist) {
            throw new Error("User not found");
        }
        const userId = isUserExist._id;
        const userName = isUserExist.name;
        const userAddress = isUserExist.address;
        const userPhone = isUserExist.phone;
        // Find the booking using the provided TotalPayTran_id
        const isBookingExists = yield booking_model_1.default.findOne({
            TotalPayTran_id: TotalPayTran_id,
        });
        if (!isBookingExists) {
            throw new Error("Booking not found for the provided Transaction ID");
        }
        const TotalAmount = isBookingExists.totalCost;
        // Ensure totalCost is positive
        if (TotalAmount <= 0) {
            throw new Error("Invalid total cost");
        }
        const paymentData = {
            TotalPayTran_id, // Unique per booking
            UserData: {
                email: user.email,
                userId,
                name: userName,
                phone: (userPhone === null || userPhone === void 0 ? void 0 : userPhone.toString()) || "",
                address: userAddress || "",
            },
            amount: TotalAmount,
        };
        // Proceed with the payment request
        let paymentSession;
        try {
            paymentSession = yield (0, TotalPaymentUtils_1.sendPaymentRequestFull)(paymentData);
        }
        catch (paymentError) {
            console.error("Failed to create payment session:", paymentError);
            throw new Error("Payment session creation failed");
        }
        return paymentSession;
    }
    catch (error) {
        console.error("Error in FullPaymentGetWay:", error);
        throw new Error("Failed to process full payment");
    }
});
exports.BookingService = {
    createBookingIntoDB,
    returnBikeIntoDB,
    showAllRentFromDB,
    showAllRentFromDBForAdmin,
    FullPaymentGetWay,
};
