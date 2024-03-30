import express from "express";
import { getUser } from "../controllers/apiController.js";

const apiRouter = express.Router();

apiRouter.get("/get", getUser);

export default apiRouter;
