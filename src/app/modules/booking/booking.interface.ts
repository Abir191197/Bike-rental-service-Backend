import { ObjectId } from "mongoose";

export interface TBooking {
  userId: ObjectId; // Reference to the User model
  bikeId: ObjectId; // Reference to the Bike model
  bookingId: string;
  TotalPayTran_id: string;
  startTime: Date;
  returnTime?: Date;
  advancePayment: "Pending" | "Paid";
  totalCost: number;
  totalCostPayment: "Pending" | "Paid";
  isReturned?: boolean;
}