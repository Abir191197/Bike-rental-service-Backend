import httpStatus from "http-status";
import mongoose from "mongoose";
import AppError from "../../errors/appError";
import BikeModel from "../bike/bike.model";
import { sendPaymentRequest } from "../Payment/payment.utils";
import { sendPaymentRequestFull } from "../Payment/TotalPaymentUtils";
import UserModel from "../user/user.model";
import BookingModel from "./booking.model";

const createBookingIntoDB = async (payload: {
  authUserInformation: any;
  rentalInformation: any;
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { authUserInformation, rentalInformation } = payload;

    // Check if the user exists
    const isUserExist = await UserModel.findOne({
      email: authUserInformation.email,
    }).session(session);
    if (!isUserExist) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    // Check if the bike exists and is available
    const isBikeExist = await BikeModel.findById(
      rentalInformation.bikeId
    ).session(session);
    if (!isBikeExist || isBikeExist.isAvailable === false) {
      // End session and rollback transaction
      await session.abortTransaction();
      session.endSession();
      throw new AppError(httpStatus.NOT_FOUND, "Bike not available");
    }

    const userId = isUserExist._id;
    const bikeId = isBikeExist._id;
    const UserData = isUserExist;

    // Generate a random booking ID
    const bookingId = `BOOKING-${Date.now()}-${Math.floor(
      Math.random() * 10000
    )}`;
    const TotalPayTran_id = `BOOKING-${Date.now()}-${Math.floor(
      Math.random() * 10000
    )}`;

    // Prepare payment data
    const paymentData = {
      bookingId,
      UserData,
    };

    // Create booking information (not saved yet)
    const newBookingInformation = {
      bookingId,
      TotalPayTran_id, // Include the booking ID
      userId,
      bikeId,
      startTime: rentalInformation.startTime,
      totalCost: 0,
      isReturned: false,
    };

    // Update bike availability
    await BikeModel.findByIdAndUpdate(
      bikeId,
      { isAvailable: false },
      {
        new: true,
        runValidators: true,
        session, // Ensure operation is part of the transaction
      }
    );

    // Create the booking
    await BookingModel.create([newBookingInformation], { session });

    // Initiate payment session
    let paymentSession;
    try {
      paymentSession = await sendPaymentRequest(paymentData);
    } catch (error) {
      console.error("Failed to create payment session:", error);
      await session.abortTransaction(); // Rollback transaction
      throw new Error("Failed to initiate payment session.");
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Return the payment session to the frontend
    return paymentSession;
  } catch (error) {
    await session.abortTransaction(); // Rollback transaction on any failure
    session.endSession();
    throw error; // Re-throw the error to be handled by the calling function
  }
};


//return bike for admin route

// Helper function to convert a date string to a Date object



const returnBikeIntoDB = async (id: string, returnTime: any) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid booking ID");
  }

  const isBookingExists = await BookingModel.findById(id);

  if (!isBookingExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not available");
  }

  const findBikeModelID = isBookingExists.bikeId;
  const bike = await BikeModel.findById(findBikeModelID);

  if (!bike) {
    throw new AppError(httpStatus.NOT_FOUND, "Bike not found");
  }

  const timePer: number = bike.PerHour;

  // Ensure both times are Date objects
  const startTime: Date = new Date(isBookingExists.startTime);
  const returnDateTime: Date = new Date(returnTime);

  if (isNaN(startTime.getTime()) || isNaN(returnDateTime.getTime())) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid date format");
  }

  // Calculate total time in hours
  const totalTime: number =
    (returnDateTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

  if (totalTime < 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Return time cannot be before start time"
    );
  }

  // Calculate total cost
  const totalCost: number = Math.round(totalTime * timePer);

  // Ensure totalCost is a valid number
  if (isNaN(totalCost)) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to calculate total cost"
    );
  }

  // Update the bike availability
  await BikeModel.findByIdAndUpdate(
    findBikeModelID,
    { isAvailable: true },
    { new: true, runValidators: true }
  );

  // Update the booking record
  await BookingModel.findByIdAndUpdate(
    id,
    { returnTime: returnDateTime, totalCost: totalCost, isReturned: true },
    { new: true, runValidators: true }
  );
};


const showAllRentFromDB = async (User: any) => {
  try {
    // Find the user by email
    const isUserExist = await UserModel.findOne({ email: User.email });

    if (!isUserExist) {
      throw new Error("User not found");
    }

    const userId = isUserExist._id;

    // Find bookings for the user and populate bike details
    const bookings = await BookingModel.find({ userId }).populate({
      path: "bikeId", // Path to the bikeId field in the BookingModel
      select: "fullbike_name PerHour imgSrc bikeId", // Select fields from the BikeModel
    });

    // Filter bookings to exclude those with failed advance payment
    const filteredBookings = bookings.filter(
      (booking: any) => booking.advancePayment !== "Failed"
    );

    return {
      bookings: filteredBookings,
    };
  } catch (error) {
    console.error("Error fetching rentals:", error);
    throw error;
  }
};

const showAllRentFromDBForAdmin = async () => {
  try {
    const result = await BookingModel.find().populate([
      {
        path: "bikeId", // Path to the bikeId field in the BookingModel
        select: "fullbike_name PerHour imgSrc bikeId", // Select fields from the BikeModel
      },
      {
        path: "userId", // Path to the UserId field in the BookingModel
        select: "name phone", // Select fields from the UserModel
      },
    ]);

    return result;
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to retrieve rentals");
  }
};

//full payment URL link get Way

const FullPaymentGetWay = async (
  TotalPayTran_id: string,
  user: { email: string }
) => {
  try {
    // Find the user by email
    const isUserExist = await UserModel.findOne({ email: user.email });

    if (!isUserExist) {
      throw new Error("User not found");
    }

    const userId = isUserExist._id;
    const userName = isUserExist.name;
    const userAddress = isUserExist.address;
    const userPhone = isUserExist.phone;

    // Find the booking using the provided TotalPayTran_id
    const isBookingExists = await BookingModel.findOne({
      TotalPayTran_id: TotalPayTran_id,
    });

    if (!isBookingExists) {
      throw new Error("Booking not found for the provided Transaction ID");
    }

    const TotalAmount = isBookingExists.totalCost;

    // Ensure totalCost is positive
    if (TotalAmount <= 0) {
      throw new Error("Invalid total cost");
    }

    const paymentData = {
      TotalPayTran_id, // Unique per booking
      UserData: {
        email: user.email,
        userId,
        name: userName,
        phone: userPhone?.toString() || "",
        address: userAddress || "",
      },
      amount: TotalAmount,
    };

    // Proceed with the payment request
    let paymentSession;
    try {
      paymentSession = await sendPaymentRequestFull(paymentData as any);
    } catch (paymentError) {
      console.error("Failed to create payment session:", paymentError);
      throw new Error("Payment session creation failed");
    }

    return paymentSession;
  } catch (error) {
    console.error("Error in FullPaymentGetWay:", error);
    throw new Error("Failed to process full payment");
  }
};

export const BookingService = {
  createBookingIntoDB,
  returnBikeIntoDB,
  showAllRentFromDB,
  showAllRentFromDBForAdmin,
  FullPaymentGetWay,
};
