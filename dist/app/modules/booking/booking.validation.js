"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingValidation = void 0;
const zod_1 = require("zod");
// Custom validation for MongoDB ObjectId
const ObjectId = zod_1.z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
    message: "Invalid ObjectId",
});
const bookingValidationSchema = zod_1.z.object({
    userId: ObjectId,
    bikeId: ObjectId,
    startTime: zod_1.z.date({ required_error: "Start time is required" }),
    returnTime: zod_1.z.date({ required_error: "Return time is required" }),
    totalCost: zod_1.z
        .number()
        .nonnegative({ message: "Total cost must be a non-negative number" }),
    isReturned: zod_1.z.boolean().optional().default(false),
});
exports.BookingValidation = {
    bookingValidationSchema,
};
