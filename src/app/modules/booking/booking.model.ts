import { Schema, model } from "mongoose";
import { TBooking } from "./booking.interface";

const BookingSchema: Schema<TBooking> = new Schema<TBooking>({
  userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  bikeId: { type: Schema.Types.ObjectId, ref: "bikes", required: true },
  bookingId: { type: String, required: true },
  TotalPayTran_id: { type: String, require: true },
  startTime: { type: Date, required: true },
  returnTime: { type: Date, default: null },
  totalCost: { type: Number, default: 0 },
  advancePayment: {
    type: String,
    enum: ["Pending", "Paid"],
    default: "Pending",
  }, // Default to "Pending"
  totalCostPayment: {
    type: String,
    enum: ["Pending", "Paid"],
    default: "Pending",
  }, // Default to "Pending"
  isReturned: { type: Boolean, default: false },
});

const BookingModel = model<TBooking>("Booking", BookingSchema);

export default BookingModel;
