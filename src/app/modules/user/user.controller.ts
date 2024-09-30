import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service";



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


const addFollowing = catchAsync(async (req, res) => {
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
    const result = await UserService.addFollowingToUser(req.user, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Following  successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Failed to add following",
      data: null,
    });
  }
});



const getMyFollowers = catchAsync(async (req, res) => {
  if (!req.user) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: "User not authenticated",
      data: null,
    });
  }

  const followers = await UserService.getMyFollowers(req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Followers retrieved successfully",
    data: followers,
  });
});

export const userControllers = {
  findUser,
  updatedUser,
  addFollowing,
  getMyFollowers,
};
