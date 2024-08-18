import { error } from "console";
import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status";

const APInotfound = (req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API not found",
    error: error,
  });
};

export default APInotfound;
