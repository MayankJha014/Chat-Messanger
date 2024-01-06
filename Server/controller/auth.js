const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserSchema = require("../model/user");
const ApiError = require("../middleware/apiError");
const Response = require("../middleware/response");
const { use } = require("../routes/auth");

async function signUp(req, res) {
  try {
    const { name, email, password, profilePic } = req.body;
    console.log(name);

    if (!name)
      return Response.error(res, ApiError.badRequest("Name is required"));

    if (!email)
      return Response.error(res, ApiError.badRequest("Email is required"));

    if (!password)
      return Response.error(res, ApiError.badRequest("Password is required"));

    const existingUser = await UserSchema.findOne({ email: email });
    if (existingUser) {
      return Response.error(
        res,
        ApiError.badRequest("User with email already exist!")
      );
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    let user;
    if (profilePic) {
      user = new UserSchema({
        name: name,
        email: email,
        password: hashedPassword,
        profilePic: profilePic,
      });
    } else {
      user = new UserSchema({
        name: name,
        email: email,
        password: hashedPassword,
      });
    }
    user = await user.save();
    const token = jwt.sign({ id: user._id }, "passwordKey");

    const result = {
      ...user._doc,
      token,
    };
    return Response.success(res, "User registered successfully", result);
  } catch (err) {
    if (err instanceof ApiError) return Response.error(res, err);
    return Response.error(res, ApiError.internal(err));
  }
}

async function login(req, res) {
  try {
    const authBody = req.body;

    if (!authBody)
      return Response.error(
        res,
        ApiError.badRequest("Email and Password is required")
      );

    if (!authBody.email)
      return Response.error(res, ApiError.badRequest("Email is required"));

    if (!authBody.password)
      return Response.error(res, ApiError.badRequest("Password is required"));

    const user = await UserSchema.findOne({ email: authBody.email });

    if (!user) {
      return Response.error(
        res,
        ApiError.notFound("User with this email does not exist!")
      );
    }
    const isMatch = await bcrypt.compare(authBody.password, user.password);
    if (!isMatch) {
      return Response.error(res, ApiError.badRequest("Incorrect password!!!"));
    }
    const token = jwt.sign({ id: user._id }, "passwordKey");

    const result = {
      ...user._doc,
      token,
    };

    return Response.success(res, "You loggedIn successfully", result);
  } catch (err) {
    if (err instanceof ApiError) return Response.error(res, err);
    return Response.error(res, ApiError.internal(err));
  }
}

async function searchUser(req, res) {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const users = await UserSchema.find(keyword).find({
      _id: { $ne: req.user },
    });

    return Response.success(res, "Fetched searched user", users);
  } catch (err) {
    if (err instanceof ApiError) return Response.error(res, err);
    return Response.error(res, ApiError.internal(err));
  }
}

module.exports = { signUp, login, searchUser };
