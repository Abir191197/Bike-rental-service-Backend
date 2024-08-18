// Define the constant for user roles
export const USER_ROLE = {
  user: "user",
  admin: "admin",
} as const;

// Derive the type for user roles
export type TUserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
