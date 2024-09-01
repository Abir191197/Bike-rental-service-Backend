import bcrypt from "bcrypt";
import httpStatus from "http-status";
import UserModel from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import AppError from "../../errors/appError";
import { TUser } from "../user/user.interface";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../../utils/jwt";
import config from "../../../config";



const getNextGoogleId = async () => {
  const maxUser = await UserModel.findOne({}, { googleId: 1 })
    .sort({ googleId: -1 })
    .exec();
  if (!maxUser || maxUser.googleId === null) {
    return 1; // Start from 1 if no users exist or if all `googleId`s are null
  }
  return maxUser.googleId + 1; // Increment the highest value
};

// SignInUser function
const signInUser = async (payload: TUser) => {
  const hashedPassword = await bcrypt.hash(payload.password, 10);
  payload.password = hashedPassword;

  // Generate new googleId by incrementing the highest existing googleId
  const newGoogleId = await getNextGoogleId();
  payload.googleId = String(newGoogleId);

  const result = await UserModel.create(payload);
  const { password, ...userWithoutSensitiveFields } = result.toObject();
  return userWithoutSensitiveFields;
};

// LogInUser function
const logInUser = async (payload: TLoginUser) => {
  // Checking if the user exists
  const user = await UserModel.findOne({ email: payload?.email }).select(
    "+password"
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found!");
  }

  const isMatch = await bcrypt.compare(payload?.password, user.password);
  if (!isMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials!");
  }

  // Generate tokens
  const jwtPayload = { email: user.email, role: user.role };
  const accessToken = generateAccessToken(jwtPayload);
  const refreshToken = generateRefreshToken(jwtPayload);

  return { user, accessToken, refreshToken };
};

// RefreshToken function
const refreshToken = async (token: string) => {
  const decoded = verifyToken(token, config.jwt_access_secret as string);
  const { email, role } = decoded;

  const jwtPayload = { email, role };
  const newAccessToken = generateAccessToken(jwtPayload);

  return { accessToken: newAccessToken };
};



// GoogleAuth function

const googleAuth = async (user: any) => {

  let existingUser = await UserModel.findOne({ email: user.email });
  if (!existingUser) {
    throw new Error("User not found");
  }

  // Generate tokens
  const jwtPayload = { email: existingUser.email, role: existingUser.role };
  const accessToken = generateAccessToken(jwtPayload);
  const refreshToken = generateRefreshToken(jwtPayload);

  return { existingUser, accessToken, refreshToken };
};


export const AuthServices = {
  signInUser,
  logInUser,
  refreshToken,
  googleAuth,
};
