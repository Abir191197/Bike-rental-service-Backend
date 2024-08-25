import BikeModel from "./bike.model";
import TBike from "./bike.interface";
import AppError from "../../errors/appError";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";

const createBikeIntoDB = async (bikeData: TBike): Promise<TBike> => {
  const bike = new BikeModel(bikeData);
  await bike.save();
  return bike.toObject();
};
const getAllBikeFromDB = async () => {
  try {
    const result = await BikeModel.find();
    return result;
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to retrieved Bike");
  }
};

const getBikeById = async (id: any) => {
  try {
    const result = await BikeModel.findById(id);
    if (!result) {
      throw new AppError(httpStatus.NOT_FOUND, "Bike not found");
    }
    return result;
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to retrieve Bike");
  }
};


const updatedBikeIntoDB = async (
  payload: JwtPayload | null,
  updateData: Partial<TBike>,
) => {
  try {
    if (payload !== null) {
      const updatedBike = await BikeModel.findOneAndUpdate(
        { id: payload.id },
        { $set: updateData },
        { new: true, runValidators: true },
      );
      if (!updatedBike) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
      }

      return updatedBike;
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid payload");
    }
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to update bike");
  }
};

const deleteBikeIntoDB = async (payload: JwtPayload | null) => {
  try {
    const result = await BikeModel.findByIdAndDelete(payload?.id);
    return result;
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete Bike");
  }
};

export const bikeService = {
  createBikeIntoDB,
  getAllBikeFromDB,
  updatedBikeIntoDB,
  deleteBikeIntoDB,
  getBikeById,
};
