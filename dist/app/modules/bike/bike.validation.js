"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BikeValidation = void 0;
const zod_1 = require("zod");
const bikeValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, { message: "Name is required" }),
        description: zod_1.z.string().min(1, { message: "Description is required" }),
        pricePerHour: zod_1.z
            .number()
            .nonnegative({ message: "Price per hour must be a non-negative number" }),
        isAvailable: zod_1.z.boolean().optional().default(true),
        cc: zod_1.z
            .number()
            .int()
            .nonnegative({ message: "CC must be a non-negative integer" }),
        year: zod_1.z
            .number()
            .int()
            .nonnegative({ message: "Year must be a non-negative integer" }),
        model: zod_1.z.string().min(1, { message: "Model is required" }),
        brand: zod_1.z.string().min(1, { message: "Brand is required" }),
    }),
});
exports.BikeValidation = {
    bikeValidationSchema,
};
