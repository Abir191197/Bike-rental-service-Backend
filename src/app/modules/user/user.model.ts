import mongoose, { Schema } from "mongoose";
import { TUser } from "./user.interface";

const UserSchema = new Schema<TUser>(
  {
    name: { type: String, required: true },
<<<<<<< HEAD
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
=======
    email: { type: String, required: true},
    password: { type: String, required: true},
>>>>>>> 048a7b4 (Complete)
    phone: { type: String, required: true },
    address: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], required: true },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<TUser>("Users",UserSchema,"Users");

export default UserModel;
