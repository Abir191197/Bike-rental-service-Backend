import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import config from "../../../config";

// SignIn function
const signIn = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.signInUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User signed up successfully!",
    data: result,
  });
});

// LogIn function
const logIn = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.logInUser(req.body);
  const { accessToken, refreshToken } = result; // Assuming the result includes accessToken
  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
  });

  res.cookie("accessToken", accessToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
  });

  // Example user data
  const userData = {
    _id: result.user._id,
    name: result.user.name,
    email: result.user.email,
    phone: result.user.phone,
    address: result.user.address,
    role: result.user.role,
  };

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    token: result.accessToken,
    data: userData,
  });
});

// RefreshToken function
const refreshAccessToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token refreshed successfully!",
    token: result.accessToken,
    data: null, // Optionally include additional data if needed
  });
});

const google = catchAsync(async (req: Request, res: Response) => {
  const user = req.user; // User info from Passport

  // Optionally log user information for debugging
  //console.log(`Authenticated user: ${user?.email}`);

  // Redirect to your dashboard or desired page
  res.redirect("/dashboard");
});

export const AuthControllers = {
  signIn,
  logIn,
  refreshAccessToken,
  google,
};
