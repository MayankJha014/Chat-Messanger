class ApiError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.message = message;
  }

  static badRequest(msg) {
    return new ApiError(400, msg);
  }

  static notFound(msg) {
    return new ApiError(404, msg || "Not found");
  }

  static notAuthorized() {
    return new ApiError(401, "User Not Authorized");
  }

  static internal(err) {
    return new ApiError(500, "Server error : " + err.message);
  }
}

module.exports = ApiError;
