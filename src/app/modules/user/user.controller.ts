import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service";

// Controller to handle creating a new user
const createUser = catchAsync(async (req, res) => {
  try {
    const result = await UserService.createUserIntoDB(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User is created successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Failed to create user",
      data: null,
    });
  }
});

// Controller to handle retrieving a user profile
const findUser = catchAsync(async (req, res) => {
  if (!req.user) {
    // Handle case where req.user is undefined
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: "User not authenticated",
      data: null,
    });
  }

  try {
    const result = await UserService.findUserFromDB(req.user);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User profile retrieved successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Failed to retrieve user profile",
      data: null,
    });
  }
});

// Controller to handle updating a user profile
const updatedUser = catchAsync(async (req, res) => {
  if (!req.user) {
    // Handle case where req.user is undefined
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: "User not authenticated",
      data: null,
    });
  }

  try {
    const result = await UserService.updatedUserIntoDB(req.user, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Profile updated successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Failed to update profile",
      data: null,
    });
  }
});

export const userControllers = {
  createUser,
  findUser,
  updatedUser,
};
