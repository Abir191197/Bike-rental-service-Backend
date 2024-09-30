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
exports.verifyPayment = exports.sendPaymentRequestFull = void 0;
const axios_1 = __importDefault(require("axios")); // Use this line only if running in a Node.js environment
const config_1 = __importDefault(require("../../../config"));
const url = config_1.default.PAYMENT_URL;
const headers = {
    "Content-Type": "application/json",
};
function sendPaymentRequestFull(paymentData) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const payload = {
            store_id: config_1.default.STORE_ID,
            signature_key: config_1.default.SIGNATURE_KEY,
            tran_id: paymentData.TotalPayTran_id,
            success_url: `https://bike-rental-service-backend-two.vercel.app/api/payment/TotalPayConfirmation?TotalPayTran_id=${paymentData.TotalPayTran_id}&status=success`,
            fail_url: `https://bike-rental-service-backend-two.vercel.app/api/payment/TotalPayFailed?TotalPayTran_id=${paymentData.TotalPayTran_id}&status=failed`,
            cancel_url: "https://cox-s-sea-side-bike-frontend.vercel.app/",
            amount: (paymentData.amount || 100).toFixed(2), // Use dynamic amount if provided, fallback to 100
            currency: "BDT",
            desc: "Total Payment",
            cus_name: paymentData.UserData.name,
            cus_email: paymentData.UserData.email,
            cus_add1: paymentData.UserData.address || "", // Ensure address is a string and handle undefined/null
            cus_add2: "", // Additional address field if needed
            cus_city: "", // Add city if available in TUser
            cus_state: "", // Add state if available in TUser
            cus_postcode: "", // Add postcode if available in TUser
            cus_country: "", // Add country if available in TUser
            cus_phone: ((_a = paymentData.UserData.phone) === null || _a === void 0 ? void 0 : _a.toString()) || "", // Ensure phone is a string and handle undefined/null
            type: "json",
        };
        try {
            const response = yield axios_1.default.post(url, payload, { headers });
            return response.data;
        }
        catch (error) {
            console.error("Error sending payment request:", error);
            throw error;
        }
    });
}
exports.sendPaymentRequestFull = sendPaymentRequestFull;
function verifyPayment(tnxId) {
    return __awaiter(this, void 0, void 0, function* () {
        const verifyUrl = `${config_1.default.PAYMENT_VERIFY_URL}`; // URL to verify the payment
        try {
            const response = yield axios_1.default.get(verifyUrl, {
                params: {
                    store_id: config_1.default.STORE_ID,
                    signature_key: config_1.default.SIGNATURE_KEY,
                    type: "json",
                    request_id: tnxId,
                },
            });
            return response.data;
        }
        catch (error) {
            console.error("Payment validation failed:", error);
            throw new Error("Payment validation failed!");
        }
    });
}
exports.verifyPayment = verifyPayment;
