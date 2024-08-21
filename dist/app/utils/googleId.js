"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextGoogleId = void 0;
const user_model_1 = __importDefault(require("../modules/user/user.model"));
const getNextGoogleId = () => __awaiter(void 0, void 0, void 0, function* () {
    const maxUser = yield user_model_1.default.findOne({}, { googleId: 1 })
        .sort({ googleId: -1 })
        .exec();
    if (!maxUser || maxUser.googleId === null) {
        return 1; // Start from 1 if no users exist or if all `googleId`s are null
    }
    return maxUser.googleId + 1; // Increment the highest value
});
exports.getNextGoogleId = getNextGoogleId;
