import bcrypt from "bcrypt";
import httpStatus from "http-status";
import UserModel from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import AppError from "../../errors/appError";
import { TUser } from "../user/user.interface";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../../config"; // Assuming you have a configuration file

// SignInUser function
const signInUser = async (payload: TUser) => {
  const hashedPassword = await bcrypt.hash(payload.password, 10);
  payload.password = hashedPassword;
  const result = await UserModel.create(payload);
  const { password, ...userWithoutSensitiveFields } = result.toObject();
  return userWithoutSensitiveFields;
};

// LogInUser function
const logInUser = async (payload: TLoginUser) => {
  // Checking if the user exists
  const user = await UserModel.findOne({ email: payload?.email }).select(
    "+password",
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found!");
  }
  const isMatch = await bcrypt.compare(payload?.password, user.password);
  // Creating a JWT token upon successful login
  const jwtPayload: JwtPayload = {
    email: user.email,
    role: user.role, // Assuming user has a role attribute
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: "10d",
  });

  const refreshToken = jwt.sign(
    jwtPayload,
    config.jwt_access_secret as string,
    {
      expiresIn: "30d",
    },
  );

  return { user, accessToken, refreshToken }; // Return the user, access token, and refresh token
};

// RefreshToken function
const refreshToken = async (token: string) => {
  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;
  const { email, role } = decoded;

  const jwtPayload = {
    email,
    role,
  };

  const newAccessToken = jwt.sign(
    jwtPayload,
    config.jwt_access_secret as string,
    {
      expiresIn: "10d",
    },
  );

  return {
    accessToken: newAccessToken,
  };
};

// Exporting AuthServices
export const AuthServices = {
  signInUser,
  logInUser,
  refreshToken,
};

// import httpStatus from "http-status";
// import UserModel from "../user/user.model";
// import { TLoginUser } from "./auth.interface";
// import AppError from "../../errors/appError";
// import { TUser } from "../user/user.interface";
// import jwt from "jsonwebtoken";
// import config from "../../../config/index"; // Assuming you have a configuration file
// import { JwtPayload } from "jsonwebtoken";

// const signInUser = async (payload: TUser) => {
//   const result = await UserModel.create(payload);

//     const {
//       password,
//       ...userWithoutSensitiveFields
//     } = result.toObject();

//   return userWithoutSensitiveFields;
// };

// //login start from here

// const LogInUser = async (payload: TLoginUser) => {
//   // checking if the user exists

//   const user = await UserModel.findOne({ email: payload?.email }).select(
//     "-password"
//   );

//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, "This user is not found!");
//   }

//   // Assuming you want to create a JWT token upon successful login
//   const jwtPayload: JwtPayload = {
//     email: user.email,
//     role: user.role, // Assuming user has a role attribute
//   };

//   const accessToken = jwt.sign(
//     jwtPayload,
//     config.jwt_access_secret as string,
//     { expiresIn: "10d" } // Corrected expiresIn format
//   );

//   return { user, accessToken }; // Return the user and the access token
// };

// const refreshToken = async (token: string) => {

//   const decoded = jwt.verify(
//     token,
//     config.jwt_access_secret as string
//   ) as JwtPayload;

//  const { email, role } = decoded;

//   const jwtPayload = {
//     email: email,
//     role:  role,
//   };

//   const accessToken = jwt.sign(
//     jwtPayload,
//     config.jwt_access_secret as string,
//     { expiresIn: "10d" } // Corrected expiresIn format
//   );
// return {
//   accessToken,
// };

// }

// export const AuthServices = {
//   signInUser,
//   LogInUser,
//   refreshToken,
// };
