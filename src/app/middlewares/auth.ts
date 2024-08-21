import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import AppError from "../errors/appError";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { TUserRole } from "../modules/user/user.interface";

// Extending Request type to include user property
declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "Authorization token missing or malformed"
      );
    }

    const token = authorizationHeader.split(" ")[1];
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Token not provided");
    }

    try {
      // Verify token
      const decoded = jwt.verify(
        token,
        config.jwt_access_secret as string
      ) as JwtPayload;

      // Assign decoded payload to request object
      req.user = decoded;

      // Role checking
      const role = decoded.role;
      if (requiredRoles.length === 0 || requiredRoles.includes(role)) {
        return next();
      }

      // Unauthorized if user's role doesn't match required roles
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You do not have permission to access this resource"
      );
    } catch (error) {
      if (error === "TokenExpiredError") {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "Token has expired, please log in again"
        );
      }
      // Handle other token verification errors
      throw new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired token");
    }
  });
};

export default auth;
