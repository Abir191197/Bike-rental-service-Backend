import mongoose, { Schema } from "mongoose";
import { TUser } from "./user.interface";

const UserSchema = new Schema<TUser>(
  {
    name: { type: String },
    email: { type: String },
    password: { type: String },
    phone: { type: String },
    address: { type: String },
    googleId: { type: String },

    role: { type: String, enum: ["admin", "user"], required: true },
    followers: [{ type: Schema.Types.ObjectId, ref: "Users", default: [] }],
    following: [{ type: Schema.Types.ObjectId, ref: "Users", default: [] }],
  },
  { timestamps: true }
);

const UserModel = mongoose.model<TUser>("Users", UserSchema, "Users");

export default UserModel;
