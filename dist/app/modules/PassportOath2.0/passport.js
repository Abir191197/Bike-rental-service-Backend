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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const config_1 = __importDefault(require("../../../config")); // Adjust path as needed
const user_model_1 = __importDefault(require("../user/user.model")); // Adjust path as needed
// Serialize user for session persistence
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
// Deserialize user from session
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findById(id);
        done(null, user);
    }
    catch (err) {
        done(err, null);
    }
}));
// Configure Google OAuth strategy
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: config_1.default.GOOGLE_CLIENT_ID,
    clientSecret: config_1.default.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://bike-rental-service-backend-two.vercel.app/api/auth/google/callback",
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const email = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value;
        let user = yield user_model_1.default.findOne({ email });
        if (!user) {
            // Handle user creation or other logic
            return done(new Error("User not found"));
        }
        return done(null, user);
    }
    catch (err) {
        console.error("Error during OAuth callback:", err);
        return done(err);
    }
})));
exports.default = passport_1.default;
