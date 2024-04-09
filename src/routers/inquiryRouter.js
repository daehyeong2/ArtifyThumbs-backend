import express from "express";
import {
  createInquiry,
  getAllInquiries,
  getInquiry,
} from "../controllers/inquiryController.js";

const inquiryRouter = express.Router();

inquiryRouter.post("/create", createInquiry);
inquiryRouter.post("/get", getInquiry);
inquiryRouter.get("/getAll", getAllInquiries);

export default inquiryRouter;
