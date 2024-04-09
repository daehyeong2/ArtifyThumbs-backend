import express from "express";
import {
  getApplication,
  getApplications,
  postApply,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/apply", postApply);
orderRouter.post("/get", getApplication);
orderRouter.get("/getAll", getApplications);

export default orderRouter;
