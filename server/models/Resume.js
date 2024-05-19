const { Schema, model } = require("mongoose");

var resumeSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  parsedResume: {
    type: String,
  }
});

const ResumeModel = model("Resume", resumeSchema);

module.exports = { ResumeModel };