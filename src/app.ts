import express, { Request, Response } from "express";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import APInotfound from "./app/middlewares/APInotfound";
import cors from "cors";
import router from "./app/routes";
import cookieParser from "cookie-parser";


const app = express();

//parsers
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"], // Specify the allowed origin(s)
    credentials: true, // Allow credentials (cookies, authorization headers)
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from setup file");
});
app.use("/api", router);


//handle not found
app.use(globalErrorHandler);
app.use(APInotfound);




export default app;
