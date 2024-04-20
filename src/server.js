import express from "express";
import morgan from "morgan";
import cors from "cors";
import rootRouter from "./routers/rootRouter.js";
import http from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import Order from "./models/Order.js";

const corsOptions = {
  origin: [process.env.FRONTEND_URL, "https://admin.socket.io"],
  methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
  allowedHeaders: ["Authorization", "Content-Type"],
  credentials: true,
};

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});

instrument(io, {
  auth: false,
});

io.on("connection", (socket) => {
  console.log("A client connected");

  socket.on("chat_message", async (data, room) => {
    socket.to(room).emit("chat_message", data);
    try {
      if (!room) {
        throw new Error("룸이 지정되지 않았습니다.");
      }

      const order = await Order.findById(room);
      if (!order) {
        throw new Error("존재하지 않는 주문입니다.");
      }
      order.chats.push({
        message: data.message,
        isMe: data.isMe,
      });
      await order.save();
    } catch (e) {
      console.error("chat_message 에러:", e);
      socket.emit("error", e.message);
    }
  });
  socket.on("chat_room", (roomName) => {
    socket.join(roomName);
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const logger = morgan(
  process.env.NODE_ENV === "production" ? "combined" : "dev"
);

app.use(cors(corsOptions));
app.use(logger);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/", rootRouter);

export default server;
