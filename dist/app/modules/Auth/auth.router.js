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
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_validation_1 = require("./auth.validation");
const auth_controller_1 = require("./auth.controller");
const user_validation_1 = require("../user/user.validation");
const passport_1 = __importDefault(require("../PassportOath2.0/passport"));
const user_model_1 = __importDefault(require("../user/user.model"));
const jwt_1 = require("../../utils/jwt");
const config_1 = __importDefault(require("../../../config"));
const router = express_1.default.Router();
router.post("/signup", (0, validateRequest_1.default)(user_validation_1.UserValidation.userValidationSchema), auth_controller_1.AuthControllers.signIn);
router.post("/login", (0, validateRequest_1.default)(auth_validation_1.AuthValidation.loginValidationSchema), auth_controller_1.AuthControllers.logIn);
router.post("/refresh-token", (0, validateRequest_1.default)(auth_validation_1.AuthValidation.refreshTokenValidationSchema), auth_controller_1.AuthControllers.refreshAccessToken);
// Google OAuth routes
router.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
// Function to generate tokens
// Function to find or create a user
const googleAuth = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const flowName = "GeneralOAuthFlow"; // Adding the flow name for tracing
    try {
        let existingUser = yield user_model_1.default.findOne({ email: user.email });
        if (!existingUser) {
            console.error(`User not found in ${flowName}`);
            throw new Error("User not found");
        }
        const jwtPayload = { email: existingUser.email, role: existingUser.role };
        const accessToken = (0, jwt_1.generateAccessToken)(jwtPayload);
        const refreshToken = (0, jwt_1.generateRefreshToken)(jwtPayload);
        return { existingUser, accessToken, refreshToken };
    }
    catch (error) {
        console.error(`Error in ${flowName}:`, error);
        throw error; // Re-throw to be caught in the route handler
    }
});
// Google OAuth callback route
router.get('/google/callback', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate('google', { session: false }, (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        const flowName = "GeneralOAuthFlow"; // Adding the flow name for tracing
        if (err || !user) {
            console.error(`Error in ${flowName}:`, err || "User not authenticated");
            return res.redirect('/login'); // Redirect to login on error
        }
        try {
            // Perform Google authentication
            const { accessToken, refreshToken } = yield googleAuth(user);
            // Redirect to the frontend with the tokens
            const redirectUrl = `${config_1.default.callbackURL}?access_token=${accessToken}&refresh_token=${refreshToken}`;
            res.redirect(redirectUrl);
        }
        catch (error) {
            console.error(`Error during ${flowName}:`, error);
            res.redirect('/login'); // Redirect to login on error
        }
    }))(req, res, next);
}));
exports.AuthRoutes = router;
