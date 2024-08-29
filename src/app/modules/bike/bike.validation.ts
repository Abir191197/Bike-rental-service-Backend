import { z } from "zod";

// Define the Zod schema for nested objects
const engineSchema = z.object({
  type: z.string().optional(),
  displacement: z.string().optional(),
  power: z.string().optional(),
});

const brakesSchema = z.object({
  front_brakes: z.string().optional(),
  rear_brakes: z.string().optional(),
});

const fuelAndLubricationSchema = z.object({
  fuel_capacity: z.string().optional(),
});

const additionalFeaturesSchema = z.object({
  gearbox: z.string().optional(),
  transmission: z.string().optional(),
  clutch: z.string().optional(),
  frame: z.string().optional(),
  cooling: z.string().optional(),
  starter: z.string().optional(),
  electronic_aids: z.string().optional(),
});

// Define the main Zod schema
const bikeValidationSchema = z.object({
  fullbike_name: z.string().min(1, { message: "Bike name is required" }),
  PerHour: z
    .number()
    .nonnegative({ message: "Price per hour must be a non-negative number" }),
  isAvailable: z.boolean().optional().default(true),
  isDelete: z.boolean().default(false),
  imgSrc: z.array(z.string()).optional().default([]),
  make: z.string().optional(),
  model: z.string().min(1, { message: "Model is required" }),
  year: z.string().min(1, { message: "Year is required" }),
  type: z.string().optional(),
  engine: engineSchema.optional().default({}),
  brakes: brakesSchema.optional().default({}),
  fuel_and_lubrication: fuelAndLubricationSchema.optional().default({}),
  additional_features: additionalFeaturesSchema.optional().default({}),
  weight: z.string().optional(),
});

export const BikeValidation = {
  bikeValidationSchema,
};
