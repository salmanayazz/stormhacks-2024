const { Schema, model } = require("mongoose");

const questionsSchema = new Schema({
    kind: {
        type: String,
        required: true,
        trim: true // Removes whitespace from the input string
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
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

const QuestionsModel = model("Question", questionsSchema);

module.exports = { QuestionsModel };
