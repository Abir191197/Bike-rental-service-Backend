import { Schema, model } from "mongoose";

import { TBooking } from "./booking.interface";

const BookingSchema: Schema<TBooking> = new Schema<TBooking>({
  userId: { type: Schema.Types.ObjectId, ref: "Users" },
  bikeId: { type: Schema.Types.ObjectId, ref: "Bikes" },
  startTime: { type: Date },
  returnTime: { type: Date, default: null },
  totalCost: { type: Number, default: 0 },
  isReturned: { type: Boolean, default: false },
});

const BookingModel = model<TBooking>("Booking", BookingSchema);

export default BookingModel;
