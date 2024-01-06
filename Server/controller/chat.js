const ApiError = require("../middleware/apiError");
const Response = require("../middleware/response");
const Chat = require("../model/chat");
const UserSchema = require("../model/user");

async function accessChat(req, res) {
  try {
    const { userId } = req.body;

    if (!userId) {
      return Response.error(
        res,
        ApiError.badRequest("UserID param is required")
      );
    }
    console.log(req.user);

    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        {
          users: { $elemMatch: { $eq: req.user } },
        },
        {
          users: { $elemMatch: { $eq: userId } },
        },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await UserSchema.populate(isChat, {
      path: "latestMessage.sender",
      select: "name profilePic email",
    });

    if (isChat.length > 0) {
      return Response.success(res, "Successfully fetched Data", isChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user, userId],
      };
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      return Response.success(res, "Chat created Successfully", fullChat);
    }
  } catch (err) {
    if (err instanceof ApiError) return Response.error(res, err);
    return Response.error(res, ApiError.internal(err));
  }
}

async function fetchChats(req, res) {
  Chat.find({
    users: {
      $elemMatch: {
        $eq: req.user,
      },
    },
  })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 })
    .then(async (result) => {
      result = await UserSchema.populate(result, {
        path: "latestMessage.sender",
        select: "name profilePic email",
      });
      return Response.success(res, "Chat of User", result);
    });
}
async function fetchChatsById(req, res) {
  Chat.findById(req.params.chatId)
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 })
    .then(async (result) => {
      result = await UserSchema.populate(result, {
        path: "latestMessage.sender",
        select: "name profilePic email",
      });
      return Response.success(res, "Chat of User", result);
    });
}

async function createGroupChat(req, res) {
  try {
    if (!req.body.users || !req.body.name) {
      return Response.error(
        res,
        ApiError.notFound("Please fill all the field")
      );
    }

    var users = JSON.parse(JSON.stringify(req.body.users));
    if (users.length < 2) {
      return Response.error(
        res,
        ApiError.badRequest(
          "More than 2 users are required to form a group chat"
        )
      );
    }
    users.push(req.user);
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    return Response.success(
      res,
      "Group chat created Successfully",
      fullGroupChat
    );
  } catch (error) {
    if (error instanceof ApiError) return Response.error(res, error);
    return Response.error(res, ApiError.internal(error));
  }
}

async function updateGroupChat(req, res) {
  const { chatId, chatName, users } = req.body;

  const existingChat = await Chat.findById(chatId);

  if (!existingChat) {
    return Response.error(res, ApiError.notFound("Chat Not Found"));
  }

  if (!existingChat.isGroupChat) {
    return Response.error(res, ApiError.badRequest("Not a group chat"));
  }

  const updateChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $set: {
        chatName,
        users,
      },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  return Response.success(res, "Chat updated successfully", updateChat);
}

async function addToGroup(req, res) {
  const { chatId, userId } = req.body;

  const updateChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updateChat) {
    return Response.error(res, ApiError.notFound("Chat Not Found"));
  } else {
    return Response.success(res, "GroupChat updated successfully", updateChat);
  }
}

async function removeGroup(req, res) {
  const { chatId, userId } = req.body;

  const removeChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updateChat) {
    return Response.error(res, ApiError.notFound("Chat Not Found"));
  } else {
    return Response.success(res, "GroupChat removed successfully", removeChat);
  }
}

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  updateGroupChat,
  addToGroup,
  removeGroup,
  fetchChatsById,
};
