import express from "express";
import { postSignin, postSignup } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/signup", postSignup);
userRouter.post("/signin", postSignin);

export default userRouter;
