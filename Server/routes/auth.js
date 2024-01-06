const express = require("express");
const authRouter = express.Router();
const auth = require("../middleware/authentication");
const authController = require("../controller/auth");
const UserSchema = require("../model/user");
const Response = require("../middleware/response");
const ApiError = require("../middleware/apiError");

authRouter.post("/register", authController.signUp);
authRouter.post("/login", authController.login);
authRouter.get("/searchUser", auth, authController.searchUser);
authRouter.get("/getuser", auth, async (req, res) => {
  const user = await UserSchema.findById(req.user);
  if (!user) {
    return Response.error(res, ApiError.notFound("User not found"));
  }
  const data = { ...user._doc, token: req.token };

  return Response.success(res, "Fetched Data", data);
});

module.exports = authRouter;
