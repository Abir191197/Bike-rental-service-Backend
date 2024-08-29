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


  const result = await bikeService.getAllBikeFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All bikes retrieved successfully",
    data: result,
  });
});

const GetOneBike = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await bikeService.getBikeById(id);

  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Bike not found",
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bike retrieved successfully",
    data: result,
  });
});


const updatedBike = catchAsync(async (req, res) => {
  // Ensure req.user is properly typed and authenticated
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
  GetOneBike,
};
