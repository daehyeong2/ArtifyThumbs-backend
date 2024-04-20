import express from "express";
import {
  createInquiry,
  getAllInquiries,
  getInquiry,
} from "../controllers/inquiryController.js";
import jwt from "jsonwebtoken";

const inquiryRouter = express.Router();

inquiryRouter.post("/create", createInquiry);
inquiryRouter.post("/get", verifyToken, getInquiry);
inquiryRouter.get("/getAll", verifyToken, getAllInquiries);

function verifyToken(req, res, next) {
  // 요청 헤더에서 JWT 토큰 가져오기
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    // 'Bearer <token>' 형태로 온다고 가정
    const bearerToken = bearerHeader.split(" ")[1];
    // 토큰 설정
    try {
      const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
      req.token = decoded;
    } catch {
      return res.sendStatus(400);
    }
    next();
  } else {
    // 인증 실패
    res.sendStatus(400); // Forbidden
  }
}

export default inquiryRouter;
