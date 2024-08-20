import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import config from "../../../config";
import AppError from "../../errors/appError";

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
  const { accessToken, refreshToken } = result;

  // Set HttpOnly and Secure cookies for refreshToken and accessToken
  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict", // Prevent CSRF attacks
  });

  res.cookie("accessToken", accessToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict",
  });

  // Filter user data to exclude sensitive information
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
    token: accessToken,
    data: userData,
  });
});

// RefreshToken function
const refreshAccessToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Refresh token not provided");
  }

  const result = await AuthServices.refreshToken(refreshToken);

  // Set new access token in cookie
  res.cookie("accessToken", result.accessToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict",
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token refreshed successfully!",
    token: result.accessToken,
    data: null,
  });
});

// Google OAuth callback

const google = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Google authentication failed");
  }

  // Call AuthServices.googleAuth to get or create the user and generate tokens
  const { existingUser, accessToken, refreshToken } = await AuthServices.googleAuth(user);

  // Set cookies for access and refresh tokens
  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict",
  });

  res.cookie("accessToken", accessToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict",
  });

  // Redirect to the desired page after successful authentication
  res.redirect("/dashboard"); // Adjust as per your client-side routing
});



export const AuthControllers = {
  signIn,
  logIn,
  refreshAccessToken,
  google,
};
