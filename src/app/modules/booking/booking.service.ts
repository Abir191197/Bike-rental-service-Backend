import httpStatus from "http-status";
import AppError from "../../errors/appError";
import BikeModel from "../bike/bike.model";
import UserModel from "../user/user.model";
import { TBooking } from "./booking.interface";
import BookingModel from "./booking.model";

const createBookingIntoDB = async (payload: {
  authUserInformation: any;
  rentalInformation: any;
}) => {
  const { authUserInformation, rentalInformation } = payload;

  // Check if the user exists
  const isUserExist = await UserModel.findOne({
    email: authUserInformation.email,
  });
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Check if the bike exists and is available
  const isBikeExist = await BikeModel.findOne({
    _id: rentalInformation.bikeId,
  });
  if (!isBikeExist || !isBikeExist.isAvailable) {
    throw new AppError(httpStatus.NOT_FOUND, "Bike not available");
  }

  const userId = isUserExist._id;
  const bikeId = isBikeExist._id;

  const newBookingInformation = {
    userId,
    bikeId,
    startTime: rentalInformation.startTime,
    totalCost: 0,
    isReturned: false,
  };

  // Update bike availability
  // updating bike isAvailable status to false
  await BikeModel.findByIdAndUpdate(
    bikeId,
    { isAvailable: false },
    {
      new: true,
      runValidators: true,
    },
  );

  // Create the booking
  const result = await BookingModel.create(newBookingInformation);
  return result;
};

//return bike for admin route

const returnBikeIntoDB = async (id: string) => {
  const isBookingExists = await BookingModel.findOne({
    _id: id,
  });

  if (!isBookingExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not available");
  }

  const findBikeModelID = isBookingExists.bikeId;

  const bikeId = await BikeModel.findById({
    _id: findBikeModelID,
  });

  const timePer: any = bikeId?.pricePerHour;

  const StartTime: any = isBookingExists?.startTime;
  const returnTime: any = new Date();
  const totalTime: number = (returnTime - StartTime) / (1000 * 60 * 60);

  const totalCost: number = Math.round(totalTime * timePer);

  // updated bike available

  await BikeModel.findByIdAndUpdate(
    findBikeModelID,
    { isAvailable: true },
    {
      new: true,
      runValidators: true,
    },
  );

  //updated booking model

  await BookingModel.findByIdAndUpdate(
    isBookingExists,
    { returnTime: new Date(), totalCost: totalCost, isReturned: true },

    {
      new: true,
      runValidators: true,
    },
  );
};

const showAllRentFromDB = async (User: any) => {
  const isUserExist = await UserModel.findOne({
    email: User.email,
  });

  const userId = isUserExist?._id;

  //find booking model that user booking exist or not

  const isBookingExists = await BookingModel.find({
    userId: userId,
  });

  return isBookingExists;
};

const showAllRentFromDBForAdmin = async () => {
  try {
    const result = await BookingModel.find(); // Retrieves all bookings
    return result;
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to retrieve rentals");
  }
};

export const BookingService = {
  createBookingIntoDB,
  returnBikeIntoDB,
  showAllRentFromDB,
  showAllRentFromDBForAdmin,
};
