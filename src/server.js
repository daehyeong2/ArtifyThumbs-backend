import http from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import admin from "firebase-admin";
import _ from "lodash";

const stringServiceAccount = process.env.FIREBASE_CREDENTIALS;

const serviceAccount = JSON.parse(stringServiceAccount);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const corsOptions = {
  origin: [process.env.FRONTEND_URL, "https://admin.socket.io"],
  methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
  allowedHeaders: ["Authorization", "Content-Type"],
};

const server = http.createServer();
const io = new Server(server, {
  cors: corsOptions,
});

instrument(io, {
  auth: {
    type: "basic",
    username: process.env.SOCKET_USERNAME,
    password: "$2a$12$YbGtFU0vMBCCQIJL7gww4.kLzDY7/QiAjH6BDfAHK24sunXLaBCRi",
  },
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
});

const newMessages = {};

io.on("connection", (socket) => {
  const token = socket.handshake.query.token;
  if (!token) {
    throw new Error("토큰이 비어있습니다.");
  }
  admin
    .auth()
    .verifyIdToken(token)
    .then(async (decodedToken) => {
      const userQuery = db
        .collection("users")
        .where("userId", "==", decodedToken.uid)
        .limit(1);
      const userSnapshot = await userQuery.get();
      let user;
      let order;
      let orderRef;
      let room;
      if (!userSnapshot.empty) {
        user = userSnapshot.docs[0].data();
      }
      if (!user) {
        throw new Error("권한이 없습니다.");
      }
      socket.on("chat_message", async (data, room) => {
        try {
          if (!room) {
            throw new Error("방이 지정되지 않았습니다.");
          }
          if (!order) {
            const _orderRef = db.doc(`orders/${room}`);
            const orderDoc = await _orderRef.get();
            if (!orderDoc.exists) {
              throw new Error("존재하지 않는 주문입니다.");
            } else {
              order = orderDoc.data();
              orderRef = _orderRef;
            }
          }
          if (!user.isAdmin && user.userId !== order.orderer) {
            throw new Error("권한이 없습니다.");
          } else if (!user.isAdmin && data.isMe === false) {
            throw new Error("권한이 없습니다.");
          }
          const roomSockets = io.sockets.adapter.rooms.get(room);
          const isClient = socket.role === "client";
          let isRead = false;

          if (roomSockets) {
            for (let socketId of roomSockets) {
              const clientSocket = io.sockets.sockets.get(socketId);
              if (clientSocket.role === (isClient ? "admin" : "client")) {
                isRead = true;
                break;
              }
            }
          }
          const messageObject = {
            message: data.message,
            timestamp: data.timestamp,
            isMe: data.isMe,
            isRead,
            imageUrl: data.imageUrl ?? "",
          };
          if (!newMessages[room]) {
            newMessages[room] = [];
          }
          if (
            newMessages[room].filter((item) => _.isEqual(item, messageObject))
              .length === 0
          ) {
            newMessages[room].push(messageObject);
          }
          socket.to(room).emit("chat_message", messageObject);
        } catch (e) {
          console.error("chat_message 에러:", e);
          socket.emit("error", e.message);
        }
      });
      socket.on("role", (role) => {
        socket["role"] = role;
      });
      socket.on("chat_room", async (roomName) => {
        const _orderRef = db.doc(`orders/${roomName}`);
        const orderDoc = await _orderRef.get();

        if (!orderDoc.exists) {
          throw new Error("존재하지 않는 주문입니다.");
        } else {
          order = orderDoc.data();
          orderRef = _orderRef;
        }
        if (user.userId !== order.orderer && !user.isAdmin) return;
        if (!newMessages[roomName]) {
          newMessages[roomName] = [];
        } else if (newMessages[roomName].length > 0) {
          const roomSockets = io.sockets.adapter.rooms.get(roomName);
          const isClient = socket.role === "client";
          let isRead = false;

          if (roomSockets) {
            for (let socketId of roomSockets) {
              const clientSocket = io.sockets.sockets.get(socketId);
              if (clientSocket.role === (isClient ? "admin" : "client")) {
                isRead = true;
                break;
              }
            }
          }
          newMessages[roomName][newMessages[roomName].length - 1].isRead =
            isRead;
          socket.emit("chats", newMessages[roomName]);
        }
        room = roomName;
        await socket.join(roomName);
      });
      socket.on("disconnecting", async () => {
        if (newMessages[room]?.length > 0) {
          const _orderRef = db.doc(`orders/${room}`);
          const orderDoc = await _orderRef.get();
          if (orderDoc.exists) {
            await orderRef?.update({
              chats: admin.firestore.FieldValue.arrayUnion(
                ...newMessages[room]
              ),
            });
            newMessages[room] = [];
          }
        }
      });
      socket.on("delete_message", async (chat) => {
        if (!user.isAdmin && !chat.isMe) throw new Error("권한이 없습니다.");
        if (
          newMessages[room] &&
          newMessages[room].filter((item) => _.isEqual(item, chat)).length === 1
        ) {
          newMessages[room] = newMessages[room].filter(
            (item) => !_.isEqual(item, chat)
          );
        } else {
          try {
            const newOrder = await orderRef?.update({
              chats: order.chats.filter((item) => !_.isEqual(item, chat)),
            });
            order = newOrder;
          } catch (e) {
            throw new Error(`Delete Error: ${e}`);
          }
        }
        socket.to(room).emit("delete_message", chat);
      });
    })
    .catch((e) => {
      console.error("인증 실패:", e);
      socket.disconnect();
    });
});

export default server;
