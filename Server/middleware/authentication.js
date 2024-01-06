const jwt = require("jsonwebtoken");
const ApiError = require("./apiError");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token || token === "")
      return Response.error(res, ApiError.badRequest("Token is required"));

    const verified = jwt.verify(token, "passwordKey");
    if (!verified) return Response.error(res, ApiError.notAuthorized());

    req.user = verified.id;
    req.token = token;
    next();
  } catch (err) {
    return Response.error(res, ApiError.internal(err));
  }
};

module.exports = auth;
