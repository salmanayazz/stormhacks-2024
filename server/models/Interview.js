const { Schema, model, trusted } = require("mongoose");

var interviewSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  jobPosting: {
    type: String,
    required: true
  },
  info: [
    {
        type: Schema.Types.ObjectId,
        ref: "Question"
    }
    ]
});

const InterviewModel = model("Interview", interviewSchema);

module.exports = { InterviewModel };