const { Schema, model } = require("mongoose");

var interviewSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  questions: {
    type: String,
    required: true,
  },
});

const InterviewModel = model("Interview", interviewSchema);

module.exports = { InterviewModel };