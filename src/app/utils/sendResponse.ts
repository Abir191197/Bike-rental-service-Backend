import { Response } from "express";

interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  token?: string;
  data?: T;
}

const sendResponse = <T>(res: Response, responseData: ApiResponse<T>) => {
  const { statusCode, success, message, data, token } = responseData;
  res.status(statusCode).json({ success, statusCode, message, data, token });
};

export default sendResponse;
