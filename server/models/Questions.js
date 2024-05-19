const { Schema, model } = require("mongoose");

const questionsSchema = new Schema({
    kind: {
        type: String,
        required: true,
        trim: true 
    },
    question: {
        type: String,
        required: true,
        trim: true
    },
    answer: {
        type: String,
        //required: true,
        trim: true
    },
    feedback: {
        type: String,
        //required: true,
        trim: true
    }
}, {
    timestamps: true 
});

const QuestionsModel = model("Question", questionsSchema);

module.exports = { QuestionsModel };
