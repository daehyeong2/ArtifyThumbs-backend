import express from "express";
import morgan from "morgan";
import cors from "cors";
import rootRouter from "./routers/rootRouter.js";

const app = express();
const logger = morgan(
  process.env.NODE_ENV === "production" ? "combined" : "dev"
);

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
  allowedHeaders: ["Authorization", "Content-Type"],
};

app.use(cors(corsOptions));
app.use(logger);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/", rootRouter);

export default app;
