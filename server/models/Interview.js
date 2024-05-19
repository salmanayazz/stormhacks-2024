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
  info: [
    {
        question:{
            type: String
        },
        answer:{
            type:String
        },
        feedback:{
            type:String
        }
    },
]
});

const InterviewModel = model("Interview", interviewSchema);

module.exports = { InterviewModel };