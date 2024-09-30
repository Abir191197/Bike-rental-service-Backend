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
exports.paymentServices = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const bike_model_1 = __importDefault(require("../bike/bike.model"));
const booking_model_1 = __importDefault(require("../booking/booking.model"));
const payment_utils_1 = require("./payment.utils");
const confirmationService = (bookingId, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verify the payment status using the transaction/order ID
        const verifyResponse = yield (0, payment_utils_1.verifyPayment)(bookingId);
        let statusMessage;
        let templateFile;
        // Determine status message and template based on verification response
        if (status === "success" && verifyResponse.pay_status === "Successful") {
            statusMessage = "Payment successful";
            templateFile = "ConfirmationSuccess.html";
            // Update the payment status in the database
            yield booking_model_1.default.findOneAndUpdate({ bookingId }, { advancePayment: "Paid" });
        }
        else if (verifyResponse.pay_status === "Failed") {
            statusMessage = "Payment failed";
            templateFile = "ConfirmationFailure.html";
            // Update the payment status in the database
            const bikeBooking = yield booking_model_1.default.findOneAndUpdate({ bookingId }, { advancePayment: "Failed" });
            // If booking is found, update the bike availability
            if (bikeBooking) {
                yield bike_model_1.default.findByIdAndUpdate(bikeBooking.bikeId, { isAvailable: true }, { new: true, runValidators: true });
            }
            else {
                throw new Error("Booking not found for the given booking ID");
            }
        }
        else {
            throw new Error("Unexpected payment status or response");
        }
        // Read and modify the HTML template
        const filePath = (0, path_1.join)(__dirname, `../../../views/${templateFile}`);
        let template;
        try {
            template = (0, fs_1.readFileSync)(filePath, "utf-8");
        }
        catch (fileError) {
            console.error("Error reading template file:", fileError);
            throw new Error("Template file not found");
        }
        // Replace placeholder in the template
        template = template.replace("{{message}}", statusMessage);
        return template;
    }
    catch (error) {
        console.error("Error in confirmationService:", error);
        throw new Error("Failed to confirm payment");
    }
});
const TotalPayConfirmationService = (TotalPayTran_id, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verify the payment status using the transaction/order ID
        const verifyResponse = yield (0, payment_utils_1.verifyPayment)(TotalPayTran_id);
        let statusMessage;
        let templateFile;
        // Determine status message and template based on verification response
        if (status === "success" && verifyResponse.pay_status === "Successful") {
            statusMessage = "Payment successful";
            templateFile = "ConfirmationSuccess.html";
            // Update the payment status in the database
            yield booking_model_1.default.findOneAndUpdate({ TotalPayTran_id }, { totalCostPayment: "Paid" });
        }
        else if (verifyResponse.pay_status === "Failed") {
            statusMessage = "Payment failed";
            templateFile = "ConfirmationFailure.html";
            // Update the payment status in the database
            yield booking_model_1.default.findOneAndUpdate({ TotalPayTran_id }, { totalCostPayment: "Failed" });
        }
        else {
            throw new Error("Unexpected payment status or response");
        }
        // Read and modify the HTML template
        const filePath = (0, path_1.join)(__dirname, `../../../views/${templateFile}`);
        let template;
        try {
            template = (0, fs_1.readFileSync)(filePath, "utf-8");
        }
        catch (fileError) {
            console.error("Error reading template file:", fileError);
            throw new Error("Template file not found");
        }
        // Replace placeholder in the template
        template = template.replace("{{message}}", statusMessage);
        return template;
    }
    catch (error) {
        console.error("Error in TotalPayConfirmationService:", error);
        throw new Error("Failed to confirm payment");
    }
});
exports.paymentServices = {
    confirmationService,
    TotalPayConfirmationService,
};
