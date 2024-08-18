"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const APInotfound_1 = __importDefault(require("./app/middlewares/APInotfound"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./app/routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("./app/modules/PassportOath2.0/passport"));
const config_1 = __importDefault(require("./config"));
const app = (0, express_1.default)();
// Parsers
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "https://cox-s-sea-side-bike-frontend.vercel.app",
    ], // Specify the allowed origin(s)
    credentials: true, // Allow credentials (cookies, authorization headers)
}));
// Session middleware
app.use((0, express_session_1.default)({
    secret: config_1.default.SESSION_SECRET, // Replace with your own secret
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to `true` if using HTTPS
}));
// Initialize Passport
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Routes
app.get("/", (req, res) => {
    res.send("Hello from setup file");
});
app.use("/api", routes_1.default);
// Handle errors and not found routes
app.use(globalErrorHandler_1.default);
app.use(APInotfound_1.default);
exports.default = app;
