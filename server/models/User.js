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
  interviewList: [
    {
      type: Schema.Types.ObjectId,
      ref: "Interview"
    }
  ]
});

const UserModel = model("User", userSchema);

module.exports = { UserModel };