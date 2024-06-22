import { ObjectId } from "mongoose";

 export interface TBooking {
  userId: ObjectId; // Reference to the User model
  bikeId: ObjectId; // Reference to the Bike model
  startTime: Date;
  returnTime: Date;
  totalCost: number;
  isReturned?: boolean;
}
