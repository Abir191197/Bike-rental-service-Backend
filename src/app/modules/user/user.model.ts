import mongoose, { Schema } from "mongoose";
import { TUser } from "./user.interface";

const UserSchema = new Schema<TUser>(
  {
    name: { type: String },
    email: { type: String },
    password: { type: String },
    phone: { type: String },
    address: { type: String },
    googleId: { type: String, unique: true },
    role: { type: String, enum: ["admin", "user"], required: true },
  },
  { timestamps: true },
);

const UserModel = mongoose.model<TUser>("Users", UserSchema, "Users");

export default UserModel;
