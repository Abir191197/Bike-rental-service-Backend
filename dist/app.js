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
const config_1 = __importDefault(require("./config"));
const app = (0, express_1.default)();
// Parsers
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// CORS Options
const corsOptions = {
    origin: [
        "http://localhost:5173",
        "",
    ],
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    optionsSuccessStatus: 200,
    allowedHeaders: "Content-Type, Authorization",
};
// const corsOptions = {
//   origin: "*", // Allow all origins
//   credentials: true,
// };
app.use((0, cors_1.default)(corsOptions));
// CORS Middleware
app.use((0, cors_1.default)(corsOptions));
// Session middleware
app.use((0, express_session_1.default)({
    secret: config_1.default.SESSION_SECRET, // Ensure this is set in your environment
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production", // Set to true in production with HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
}));
// Initialize Passport
// app.use(passport.initialize());
// app.use(passport.session());
// Routes
app.get("/", (req, res) => {
    res.send("Hello from Pet Care Service");
});
app.use("/api", routes_1.default);
// Handle errors and not found routes
app.use(globalErrorHandler_1.default);
app.use(APInotfound_1.default);
exports.default = app;
