const { Schema, model } = require("mongoose");

var userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const UserModel = model("User", userSchema);

module.exports = { UserModel };