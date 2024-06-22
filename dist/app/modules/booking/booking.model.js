"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BookingSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Users" },
    bikeId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Bikes" },
    startTime: { type: Date, },
    returnTime: { type: Date, default: null },
    totalCost: { type: Number, default: 0 },
    isReturned: { type: Boolean, default: false },
});
const BookingModel = (0, mongoose_1.model)("Booking", BookingSchema);
exports.default = BookingModel;
