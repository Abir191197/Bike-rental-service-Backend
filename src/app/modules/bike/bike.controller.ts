import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { bikeService } from "./bike.service";
import AppError from "../../errors/appError";

const createBike = catchAsync(async (req, res) => {
  // Directly use req.body, which should be the bike data
  const bikeData = req.body;

  const result = await bikeService.createBikeIntoDB(bikeData);

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

  // Extract the bike ID from the request parameters
  const id = req.params.id;

  // Extract the PerHour value from the request body
  const { PerHour } = req.body;

  // Validate the input
  if (typeof PerHour !== "number" || PerHour <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid price per hour");
  }

  // Call the service function to update the bike in the database
  const result = await bikeService.updatedBikeIntoDB(id, { PerHour });

  // Send the response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bike updated successfully",
    data: result,
  });
});


const deleteBike = catchAsync(async (req, res) => {
  const { id } = req.params; // Get ID from request parameters
  
  const result = await bikeService.deleteBikeIntoDB(id);
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
