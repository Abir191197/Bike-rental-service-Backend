import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { bikeService } from "./bike.service";
import AppError from "../../errors/appError";

const createBike = catchAsync(async (req, res) => {
  const result = await bikeService.createBikeIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bike is created successfully",
    data: result,
  });
});

const GetAllBike = catchAsync(async (req, res) => {
  const result = await bikeService.getAllBikeFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All bikes retrieved successfully",
    data: result,
  });
});

const updatedBike = catchAsync(async (req, res) => {
  // Ensure req.user is properly typed
  if (!req.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  const result = await bikeService.updatedBikeIntoDB(req.user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bike updated successfully",
    data: result,
  });
});

const deleteBike = catchAsync(async (req, res) => {
  const result = await bikeService.deleteBikeIntoDB(req.params);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bike deleted successfully",
  });
});

export const bikeController = {
  createBike,
  GetAllBike,
  updatedBike,
  deleteBike,
};
