import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import config from "../../../config";

// SignIn function
const SignIn = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.signInUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is signed in successfully!",
    data: result,
  });
});

// LogIn function
const LogIn = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.logInUser(req.body);
  const { refreshToken, accessToken } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
  });

  res.cookie("accessToken", accessToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is logged in successfully!",
    data: {
      result,
    },
  });
});

// RefreshToken function
const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User access token refreshed successfully!",
    data: result,
  });
});

// Exporting AuthControllers
export const AuthControllers = {
  SignIn,
  LogIn,
  refreshToken,
};
