import express from "express";
import morgan from "morgan";
import userRouter from "./routers/userRouter.js";
import apiRouter from "./routers/apiRouter.js";
import cors from "cors";
import MongoStore from "connect-mongo";
import session from "express-session";
import orderRouter from "./routers/orderRouter.js";

const app = express();
const logger = morgan("dev");

const corsOptions = {
  origin: true,
  methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
    cookie: {
      sameSite: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      secure: process.env.NODE_ENV === "production",
    },
  })
);
app.use("/users", userRouter);
app.use("/api", apiRouter);
app.use("/orders", orderRouter);

export default app;
