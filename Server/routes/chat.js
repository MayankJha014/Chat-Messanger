const express = require("express");
const chatController = require("../controller/chat");
const auth = require("../middleware/authentication");
const chatRouter = express.Router();

chatRouter.post("/", auth, chatController.accessChat);
chatRouter.get("/api/chat", auth, chatController.fetchChats);
chatRouter.get("/api/chat/:chatId", auth, chatController.fetchChatsById);
chatRouter.post("/api/group", auth, chatController.createGroupChat);
chatRouter.post("/api/update", auth, chatController.updateGroupChat);
chatRouter.put("/api/groupadd", auth, chatController.addToGroup);
chatRouter.put("/api/groupremove", auth, chatController.removeGroup);

module.exports = chatRouter;
