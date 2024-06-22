"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const APInotfound_1 = __importDefault(require("./app/middlewares/APInotfound"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./app/routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
//parsers
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173"], // Specify the allowed origin(s)
    credentials: true, // Allow credentials (cookies, authorization headers)
}));
app.get("/", (req, res) => {
    res.send("Hello from setup file");
});
app.use("/api", routes_1.default);
//handle not found
app.use(globalErrorHandler_1.default);
app.use(APInotfound_1.default);
exports.default = app;
