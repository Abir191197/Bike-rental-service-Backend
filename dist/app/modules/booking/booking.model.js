"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BookingSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Users", required: true },
    bikeId: { type: mongoose_1.Schema.Types.ObjectId, ref: "bikes", required: true },
    bookingId: { type: String, required: true },
    TotalPayTran_id: { type: String, require: true },
    startTime: { type: Date, required: true },
    returnTime: { type: Date, default: null },
    totalCost: { type: Number, default: 0 },
    advancePayment: {
        type: String,
        enum: ["Pending", "Paid"],
        default: "Pending",
    }, // Default to "Pending"
    totalCostPayment: {
        type: String,
        enum: ["Pending", "Paid"],
        default: "Pending",
    }, // Default to "Pending"
    isReturned: { type: Boolean, default: false },
});
const BookingModel = (0, mongoose_1.model)("Booking", BookingSchema);
exports.default = BookingModel;
