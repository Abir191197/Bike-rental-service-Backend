import { Types } from "mongoose";
import { TUserRole } from "./user.constant";

// Define the user interface
export interface TUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  googleId: string;
  role: TUserRole;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
}
export { TUserRole };
