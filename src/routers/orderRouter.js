import express from "express";
import {
  getApplication,
  getApplications,
  getMyApplications,
  postApply,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/apply", verifyToken, postApply);
orderRouter.post("/get", verifyToken, getApplication);
orderRouter.get("/getAll", verifyToken, getApplications);
orderRouter.get("/getMine", verifyToken, getMyApplications);

function verifyToken(req, res, next) {
  // 요청 헤더에서 JWT 토큰 가져오기
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    // 'Bearer <token>' 형태로 온다고 가정
    const bearerToken = bearerHeader.split(" ")[1];
    // 토큰 설정
    req.token = bearerToken;
    next();
  } else {
    // 인증 실패
    res.sendStatus(403); // Forbidden
  }
}

export default orderRouter;
