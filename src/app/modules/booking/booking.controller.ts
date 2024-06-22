import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BookingService } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";



const createBooking = catchAsync(async (req, res) => {
  
    const payload = {
      rentalInformation: req.body,
      authUserInformation: req.user,
    };

  const result = await BookingService.createBookingIntoDB(payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking is created successfully",
    data: result,
  });
});

//return Bike for admin route


const returnBike = catchAsync(async (req, res) => {

  const { id } = req.params
 

  const result = await BookingService.returnBikeIntoDB(id);




  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bike return successfully",
    data: result,
  });

 });

//show user full rental data
const allBikeRentals = catchAsync(async (req, res) => {
  
  const User = req.user;
  const result = await BookingService.showAllRentFromDB(User);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rentals retrieved successfully",
    data: result,
  });
});




export const BookingController = {
  createBooking,
  returnBike,
  allBikeRentals,
};