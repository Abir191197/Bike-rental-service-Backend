
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config"; // Adjust the path to your config file

// Generate Access Token
export const generateAccessToken = (payload: JwtPayload) => {
  return jwt.sign(payload, config.jwt_access_secret as string, {
    expiresIn: "10d", // Customize as needed
  });
};

// Generate Refresh Token
export const generateRefreshToken = (payload: JwtPayload) => {
  return jwt.sign(payload, config.jwt_access_secret as string, {
    expiresIn: "30d", // Customize as needed
  });
};

// Verify Token
export const verifyToken = (token: string, secret: string): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};
