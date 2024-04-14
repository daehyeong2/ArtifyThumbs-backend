import express from "express";
import { getUser } from "../controllers/apiController.js";

const apiRouter = express.Router();

apiRouter.get("/get", verifyToken, getUser);

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    next();
  } else {
    res.status(403).json({ message: "인증 실패" });
  }
}

export default apiRouter;
