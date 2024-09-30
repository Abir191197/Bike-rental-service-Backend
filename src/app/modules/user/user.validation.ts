import { z } from "zod";

const userValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .max(20, { message: "Password must be at most 20 characters" }),
    phone: z
      .string()
      .min(10, { message: "Phone number must be at least 10 characters" }),
    address: z.string().min(1, { message: "Address is required" }),
    role: z.enum(["admin", "user"]),
    googleId: z.string().optional(),
    followers: z.array(z.string()).optional(),
    following: z.array(z.string()).optional(),
  }),
});
export const UserValidation = {
  userValidationSchema,
};
