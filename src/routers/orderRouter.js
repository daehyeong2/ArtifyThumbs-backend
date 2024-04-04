import express from "express";
import { getApplication, postApply } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/apply", postApply);
orderRouter.post("/get", getApplication);

export default orderRouter;
