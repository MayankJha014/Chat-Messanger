const ApiError = require("../middleware/apiError");
const Response = require("../middleware/response");
const Chat = require("../model/chat");
const Message = require("../model/message");
const UserSchema = require("../model/user");

async function sendMessage(req, res) {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return Response.error(
      res,
      ApiError.badRequest("Invalid data is passed into request")
    );
  }

  var newMessage = {
    sender: req.user,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name profilePic");
    message = await message.populate("chat");
    // console.log(message);
    message = await UserSchema.populate(message, {
      path: "chat.users chat.groupAdmin",
      select: "name profilePic email",
    });
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });

    return Response.success(res, "Msg sender", message);
  } catch (error) {
    if (error instanceof ApiError) return Response.error(res, error);
    return Response.error(res, ApiError.internal(error));
  }
}

async function fetchMessage(req, res) {
  try {
    const message = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name profilePic email")
      .populate("chat");

    return Response.success(res, "All Message Fetched", message);
  } catch (error) {
    if (error instanceof ApiError) return Response.error(res, error);
    return Response.error(res, ApiError.internal(error));
  }
}

module.exports = {
  sendMessage,
  fetchMessage,
};
