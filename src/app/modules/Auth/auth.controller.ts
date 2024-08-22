import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import config from "../../../config";
import AppError from "../../errors/appError";

// Helper function to set authentication cookies
const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
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
};

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
  setAuthCookies(res, accessToken, refreshToken);

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
    // Redirect to the login page or any other appropriate action
    return res.redirect("/");
  }

  // Call AuthServices.googleAuth to get or create the user and generate tokens
  const { existingUser, accessToken, refreshToken } =
    await AuthServices.googleAuth(user);
  
  


  // Set cookies for access and refresh tokens
  setAuthCookies(res, accessToken, refreshToken);

  const userData = {
    _id: existingUser._id,
    name: existingUser.name,
    email: existingUser.email,
    phone: existingUser.phone,
    address: existingUser.address,
    role: existingUser.role,
  };

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    token: accessToken,
    data: userData,
  });

 
});

export const AuthControllers = {
  signIn,
  logIn,
  refreshAccessToken,
  google,
};
