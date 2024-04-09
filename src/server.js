import express from "express";
import morgan from "morgan";
import cors from "cors";
import MongoStore from "connect-mongo";
import session from "express-session";
import rootRouter from "./routers/rootRouter.js";

const app = express();
const logger = morgan("dev");

const corsOptions = {
  origin: true,
  methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(logger);
app.use(express.urlencoded({ extended: false }));
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
      domain: process.env.FRONTEND_URL,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      secure: process.env.NODE_ENV === "production",
    },
  })
);
app.use("/", rootRouter);

export default app;
