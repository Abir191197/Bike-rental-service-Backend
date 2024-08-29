import BikeModel from "./bike.model";
import TBike from "./bike.interface";
import AppError from "../../errors/appError";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import QueryBuilder from "../../builder/QueryBuilder";

const createBikeIntoDB = async (bikeData: TBike): Promise<TBike> => {
  const bike = new BikeModel(bikeData);
  await bike.save();
  return bike.toObject();
};


const BikeSearchableFields = ["fullbike_name"]; // Adjust fields as necessary

const getAllBikeFromDB = async (query: Record<string, unknown>) => {
  try {
    const queryObj = { ...query };

    // Ensure the query excludes deleted bikes
    queryObj.isDelete = false;

    const bikeQuery = new QueryBuilder(BikeModel.find(), queryObj)
      .search(BikeSearchableFields)
      .filter() // Implement filtering based on your needs
      .paginate() // Implement pagination based on your needs
      .sort() // Implement sorting based on your needs
      .fields(); // Implement field selection if needed

    const result = await bikeQuery.modelQuery;
    return result;
  } catch (error) {
    // Handle errors
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to retrieve bikes");
  }
};


//get one bike

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
  updateData: Partial<TBike>
) => {
  try {
    if (!payload || !payload.id) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid or missing payload");
    }

    const updatedBike = await BikeModel.findOneAndUpdate(
      { _id: payload.id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedBike) {
      throw new AppError(httpStatus.NOT_FOUND, "Bike not found");
    }

    return updatedBike;
  } catch (error) {
    if (error instanceof AppError) {
      throw error; // Re-throw known AppError
    }

    // Log the error for debugging
    console.error("Error updating bike:", error);

    // Provide a more descriptive error message
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Failed to update bike. Please ensure all fields are valid."
    );
  }
};

const deleteBikeIntoDB = async (payload: JwtPayload | null) => {
  try {
    // Ensure payload and payload.id are valid
    if (!payload?.id) {
      throw new AppError(httpStatus.BAD_REQUEST, "Bike ID is required");
    }

    // Perform the soft delete by setting isDeleted to true
    const result = await BikeModel.findByIdAndUpdate(
      payload.id,
      { isDeleted: true },
      { new: true } // Return the updated document
    );

    if (!result) {
      throw new AppError(httpStatus.NOT_FOUND, "Bike not found");
    }

    return result;
  } catch (error) {
    // Handle and throw an appropriate error
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
