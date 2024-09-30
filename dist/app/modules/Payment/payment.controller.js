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
exports.PaymentController = void 0;
const payment_service_1 = require("./payment.service");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const confirmationPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookingId, status } = req.query;
    try {
        // Validate query parameters
        if (typeof bookingId !== "string" || typeof status !== "string") {
            return res.status(400).send("Invalid query parameters");
        }
        // Call the service to get the confirmation template
        const result = yield payment_service_1.paymentServices.confirmationService(bookingId, status);
        // Set content-type to HTML
        res.setHeader("Content-Type", "text/html");
        // Send the HTML response
        res.send(result);
    }
    catch (error) {
        console.error("Error in confirmationPayment:", error);
        res
            .status(500)
            .send("An error occurred while processing your payment confirmation.");
    }
}));
const TotalPayConfirmationPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { TotalPayTran_id, status } = req.query;
    try {
        // Validate query parameters
        if (typeof TotalPayTran_id !== "string" || typeof status !== "string") {
            return res.status(400).send("Invalid query parameters");
        }
        // Call the service to get the confirmation template
        const result = yield payment_service_1.paymentServices.TotalPayConfirmationService(TotalPayTran_id, status);
        // Set content-type to HTML
        res.setHeader("Content-Type", "text/html");
        // Send the HTML response
        res.send(result);
    }
    catch (error) {
        console.error("Error in TotalPayConfirmationPayment:", error);
        res
            .status(500)
            .send("An error occurred while processing your payment confirmation.");
    }
}));
exports.PaymentController = {
    confirmationPayment,
    TotalPayConfirmationPayment,
};
