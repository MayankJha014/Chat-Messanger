const moongose = require("mongoose");

const userSchema = moongose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      required: true,
      type: String,
      trim: true,
      unique: true,
      validate: {
        validator: (value) => {
          const re =
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
          return value.match(re);
        },
        message: "Please enter a valid email address",
      },
    },
    profilePic: {
      type: "String",
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    password: {
      required: true,
      type: String,
    },
  },
  { timestamps: true }
);

const UserSchema = moongose.model("user", userSchema);
module.exports = UserSchema;
