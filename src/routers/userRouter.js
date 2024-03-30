import express from "express";
import {
  logout,
  postSignin,
  postSignup,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/signup", postSignup);
userRouter.post("/signin", postSignin);
userRouter.get("/logout", logout);

export default userRouter;
