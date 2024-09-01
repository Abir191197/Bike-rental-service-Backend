import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BookingService } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";

// Define the interface with the email property
interface CustomJwtPayload extends JwtPayload {
  email: string;
  // You can add more fields as needed
}

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
  const { id } = req.params;

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

const allBikeRentalsForAdminOnly = catchAsync(async (req, res) => {
  const result = await BookingService.showAllRentFromDBForAdmin();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rentals retrieved successfully",
    data: result,
  });
});

//Full Payment Controller

const FullPayment = catchAsync(async (req, res) => {
  if (!req.user) {
    return res.status(httpStatus.UNAUTHORIZED).send({
      success: false,
      message: "User not authenticated",
    });
  }

  const { TotalPayTran_id } = req.params; // Use `req.params` for URL params
  
  const user =  req.user as CustomJwtPayload;

  try {
    const result = await BookingService.FullPaymentGetWay(
      TotalPayTran_id,
      user  
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment Info retrieved successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message:  "An error occurred",
    });
  }
});




export const BookingController = {
  createBooking,
  returnBike,
  allBikeRentals,
  allBikeRentalsForAdminOnly,
  FullPayment,
};
