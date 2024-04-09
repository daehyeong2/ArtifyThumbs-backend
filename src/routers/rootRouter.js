import express from "express";
import userRouter from "./userRouter.js";
import apiRouter from "./apiRouter.js";
import orderRouter from "./orderRouter.js";
import inquiryRouter from "./inquiryRouter.js";

const rootRouter = express.Router();

rootRouter.use("/users", userRouter);
rootRouter.use("/api", apiRouter);
rootRouter.use("/orders", orderRouter);
rootRouter.use("/inquiry", inquiryRouter);

export default rootRouter;
