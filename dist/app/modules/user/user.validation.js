"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const userValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, { message: "Name is required" }),
        email: zod_1.z.string().email({ message: "Invalid email address" }),
        password: zod_1.z
            .string()
            .min(6, { message: "Password must be at least 6 characters" })
            .max(20, { message: "Password must be at most 20 characters" }),
        phone: zod_1.z
            .string()
            .min(10, { message: "Phone number must be at least 10 characters" }),
        address: zod_1.z.string().min(1, { message: "Address is required" }),
        role: zod_1.z.enum(["admin", "user"]),
        googleId: zod_1.z.string().optional(),
        followers: zod_1.z.array(zod_1.z.string()).optional(),
        following: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.UserValidation = {
    userValidationSchema,
};
