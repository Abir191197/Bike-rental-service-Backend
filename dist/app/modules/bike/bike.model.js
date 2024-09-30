"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const BikeSchema = new mongoose_1.Schema({
    fullbike_name: { type: String, required: true },
    PerHour: { type: Number, required: true }, // Changed to Number
    isAvailable: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false }, // Renamed from 'isDeleted'
    imgSrc: { type: [String], default: [] }, // Renamed from 'imageLinks'
    make: { type: String },
    model: { type: String },
    year: { type: String }, // Changed to String
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
}, {
    timestamps: true, // Optional: Adds createdAt and updatedAt fields
});
const BikeModel = mongoose_1.default.model("bikes", BikeSchema, "bikes");
exports.default = BikeModel;
