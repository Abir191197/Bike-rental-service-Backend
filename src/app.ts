import express, { Request, Response } from "express";
import session from "express-session";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import APInotfound from "./app/middlewares/APInotfound";
import cors from "cors";
import router from "./app/routes";
import cookieParser from "cookie-parser";
import passport from "./app/modules/PassportOath2.0/passport";
import config from "./config";

const app = express();

// Parsers
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://cox-s-sea-side-bike-frontend.vercel.app",
    ], // Specify the allowed origin(s)
    credentials: true, // Allow credentials (cookies, authorization headers)
  }),
);

// Session middleware
app.use(
  session({
    secret: config.SESSION_SECRET as string, // Replace with your own secret
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to `true` if using HTTPS
  }),
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from setup file");
});
app.use("/api", router);

// Handle errors and not found routes
app.use(globalErrorHandler);
app.use(APInotfound);

export default app;
