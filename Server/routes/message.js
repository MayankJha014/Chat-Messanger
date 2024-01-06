const express = require("express");
const { model } = require("mongoose");
const messageRouter = express();
const messageController = require("../controller/message");
const auth = require("../middleware/authentication");

messageRouter.post("/api/message", auth, messageController.sendMessage);
messageRouter.get("/api/message/:chatId", auth, messageController.fetchMessage);
module.exports = messageRouter;
