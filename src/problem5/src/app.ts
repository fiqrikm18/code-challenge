import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import morgan from "morgan";
import dotenv from "dotenv";

import taskRouter from "./routes/task.routers";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/error-handler.middleware";

dotenv.config();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
app.use("/api", limiter);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(hpp());
app.use(morgan("dev"));

app.use("/api/v1/tasks", taskRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
