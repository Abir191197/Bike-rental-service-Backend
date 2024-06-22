import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { bikeService } from "./bike.service";


const createBike = catchAsync(async (req, res) => {
  const result = await bikeService.createBikeIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bike is created successfully",
    data: result,
  });
});

const GetAllBike = catchAsync(async (req, res) => {
  const result = await bikeService.getAllBikeFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All bike get successfully",
    data: result,
  });
});


const updatedBike = catchAsync(async (req, res) => {
  const result = await bikeService.updatedBikeIntoDB(req.user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "bike updated successfully",
    data: result,
  });
});
  

const deleteBike = catchAsync(async (req, res) => {
  const result = await bikeService.deleteBikeIntoDB(req.params);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "bike delete successfully",
    
  });
});

export const bikeController = {
  createBike,
  GetAllBike,
  updatedBike,
  deleteBike,
};
