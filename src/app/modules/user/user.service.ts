import bcrypt from "bcrypt";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errors/appError";
import { TUser } from "./user.interface";
import UserModel from "./user.model";
import httpStatus from "http-status";


const findUserFromDB = async (payload: JwtPayload | null) => {
  try {
    if (payload !== null) {
      const result = await UserModel.findOne({
        email: payload.email,
      }).select("-password");
      return result;
    }
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to Get User");
  }
};

const updatedUserIntoDB = async (
  payload: JwtPayload | null,
  updateData: Partial<TUser>,
) => {
  try {
    if (payload !== null) {
      const updatedUser = await UserModel.findOneAndUpdate(
        { email: payload.email },
        { $set: updateData },
        { new: true, runValidators: true },
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

const addFollowingToUser = async (
  payload: JwtPayload | null,
  updateData: Partial<TUser>,
) => {
  try {
    if (payload !== null) {
      const updatedUser = await UserModel.findOneAndUpdate(
        { email: payload.email },
        { $addToSet: { following: updateData.following } },
        { new: true, runValidators: true }
      ).select("-password");

      if (!updatedUser) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
      }

      return updatedUser;
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid payload");
    }
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to add following to user");
  }
};

const getMyFollowers = async (payload: JwtPayload | null) => {
  try {
    if (payload !== null) {
      const user = await UserModel.findOne({ email: payload.email }).select("followers");
      if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
      }
      return user.followers;
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid payload");
    }
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to get followers");
  }
};

export const UserService = {
  findUserFromDB,
  updatedUserIntoDB,
  addFollowingToUser,
  getMyFollowers,
};
