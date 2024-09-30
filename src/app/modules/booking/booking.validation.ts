import { z } from "zod";

// Custom validation for MongoDB ObjectId
const ObjectId = z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
  message: "Invalid ObjectId",
});

const bookingValidationSchema = z.object({
  userId: ObjectId,
  bikeId: ObjectId,
  startTime: z.date({ required_error: "Start time is required" }),
  returnTime: z.date({ required_error: "Return time is required" }),
  totalCost: z
    .number()
    .nonnegative({ message: "Total cost must be a non-negative number" }),
  isReturned: z.boolean().optional().default(false),
});

export const BookingValidation = {
  bookingValidationSchema,
};
