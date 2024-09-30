"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BikeValidation = void 0;
const zod_1 = require("zod");
// Define the Zod schema for nested objects
const engineSchema = zod_1.z.object({
    type: zod_1.z.string().optional(),
    displacement: zod_1.z.string().optional(),
    power: zod_1.z.string().optional(),
});
const brakesSchema = zod_1.z.object({
    front_brakes: zod_1.z.string().optional(),
    rear_brakes: zod_1.z.string().optional(),
});
const fuelAndLubricationSchema = zod_1.z.object({
    fuel_capacity: zod_1.z.string().optional(),
});
const additionalFeaturesSchema = zod_1.z.object({
    gearbox: zod_1.z.string().optional(),
    transmission: zod_1.z.string().optional(),
    clutch: zod_1.z.string().optional(),
    frame: zod_1.z.string().optional(),
    cooling: zod_1.z.string().optional(),
    starter: zod_1.z.string().optional(),
    electronic_aids: zod_1.z.string().optional(),
});
// Define the main Zod schema
const bikeValidationSchema = zod_1.z.object({
    fullbike_name: zod_1.z.string().min(1, { message: "Bike name is required" }),
    PerHour: zod_1.z
        .number()
        .nonnegative({ message: "Price per hour must be a non-negative number" }),
    isAvailable: zod_1.z.boolean().optional().default(true),
    isDelete: zod_1.z.boolean().default(false),
    imgSrc: zod_1.z.array(zod_1.z.string()).optional().default([]),
    make: zod_1.z.string().optional(),
    model: zod_1.z.string().min(1, { message: "Model is required" }),
    year: zod_1.z.string().min(1, { message: "Year is required" }),
    type: zod_1.z.string().optional(),
    engine: engineSchema.optional().default({}),
    brakes: brakesSchema.optional().default({}),
    fuel_and_lubrication: fuelAndLubricationSchema.optional().default({}),
    additional_features: additionalFeaturesSchema.optional().default({}),
    weight: zod_1.z.string().optional(),
});
exports.BikeValidation = {
    bikeValidationSchema,
};
