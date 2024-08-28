import mongoose, { Schema } from "mongoose";
import TBike from "./bike.interface";

const BikeSchema = new Schema<TBike>(
  {
    fullbike_name: { type: String, required: true },
    PerHour: { type: Number, required: true }, // Changed to Number
    isAvailable: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false }, // Renamed from 'isDeleted'
    imgSrc: { type: [String], default: [] }, // Renamed from 'imageLinks'
    make: { type: String },
    model: { type: String, required: true },
    year: { type: String, required: true }, // Changed to String
    type: { type: String },
    engine: {
      type: {
        type: { type: String },
        displacement: { type: String },
        power: { type: String },
      },
      default: {}, // Default to empty object if not provided
    },
    brakes: {
      type: {
        front_brakes: { type: String },
        rear_brakes: { type: String },
      },
      default: {}, // Default to empty object if not provided
    },
    fuel_and_lubrication: {
      type: {
        fuel_capacity: { type: String },
      },
      default: {}, // Default to empty object if not provided
    },
    additional_features: {
      type: {
        gearbox: { type: String },
        transmission: { type: String },
        clutch: { type: String },
        frame: { type: String },
        cooling: { type: String },
        starter: { type: String },
        electronic_aids: { type: String },
      },
      default: {}, // Default to empty object if not provided
    },
    weight: { type: String }, // Changed to String
  },
  {
    timestamps: true, // Optional: Adds createdAt and updatedAt fields
  }
);

const BikeModel = mongoose.model<TBike>("bikes", BikeSchema, "bikes");

export default BikeModel;
