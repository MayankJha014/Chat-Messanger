const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");
const cors = require("cors");
const chatRouter = require("./routes/chat");
const messageRouter = require("./routes/message");
const app = express();
const { Server } = require("socket.io");
const http = require("http");
require("dotenv").config();

const PORT = 4000;
const DB =
  "mongodb+srv://mayankjha014:1234@cluster0.irjg6zb.mongodb.net/Social_Message?retryWrites=true&w=majority";

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: "Content-Type,Authorization", // Specify the allowed headers
  })
);

app.use(express.json());
app.use(authRouter);
app.use(chatRouter);
app.use(messageRouter);

const server = http.createServer(app);

const io = new Server(server, {
  path: "/socket",
  pingTimeout: 60000,
  cors: {
    "Access-Control-Allow-Origin": "*",
    origin: "http://localhost:5173",
    credentials: true,
  },
  allowEIO: true,
  wssEngine: ["ws", "wss"],
  transports: ["websocket", "polling"],
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;
    // if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      console.log(newMessageReceived);
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
});

mongoose
  .connect(DB)
  .then(() =>
    server.listen(PORT, async () => {
      console.log(`Listening on ${PORT}`);
    })
  )
  .catch((e) => console.log(e));
