<<<<<<< HEAD
import { TUser } from "./user.interface";
import UserModel from "./user.model";

const createUserIntoDB = async (payload: TUser) => {
  
  

=======
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errors/appError";
import { TUser } from "./user.interface";
import UserModel from "./user.model";
import httpStatus from "http-status";

const createUserIntoDB = async (payload: TUser) => {
  
>>>>>>> 048a7b4 (Complete)
  const result = await UserModel.create(payload);
  return result;
};

<<<<<<< HEAD
export const UserService = {
  createUserIntoDB,
};
=======
const findUserFromDB = async (payload:JwtPayload|null) => {
    try {
      if (payload !== null) {
        const result = await UserModel.findOne({
          email: payload.email,
        }).select("+password");
        return result;
      }
    } catch (error) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to Get User");
    }

}

  const updatedUserIntoDB = async (payload: JwtPayload | null, updateData: Partial<TUser>) => {
  try {
    if (payload !== null) {
      const updatedUser = await UserModel.findOneAndUpdate(
        { email: payload.email },
        { $set: updateData },
        { new: true, runValidators: true }
      ).select("-password"); // Exclude the password field from the result

      if (!updatedUser) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
      }

      return updatedUser;
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid payload");
    }
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to update user");
  }
};

export const UserService = {
  createUserIntoDB,
  findUserFromDB,
  updatedUserIntoDB,
};
>>>>>>> 048a7b4 (Complete)
