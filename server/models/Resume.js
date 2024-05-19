const { Schema, model } = require("mongoose");

var resumeSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  parsedResume: {
    type: String,
  }
});

const ResumeModel = model("Resume", resumeSchema);

module.exports = { ResumeModel };