import { z } from "zod";

const bikeValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    pricePerHour: z
      .number()
      .nonnegative({ message: "Price per hour must be a non-negative number" }),
    isAvailable: z.boolean().optional().default(true),
    cc: z
      .number()
      .int()
      .nonnegative({ message: "CC must be a non-negative integer" }),
    year: z
      .number()
      .int()
      .nonnegative({ message: "Year must be a non-negative integer" }),
    model: z.string().min(1, { message: "Model is required" }),
    brand: z.string().min(1, { message: "Brand is required" }),
  }),
});

export const BikeValidation = {
  bikeValidationSchema,
};
