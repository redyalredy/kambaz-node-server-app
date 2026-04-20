import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    _id: String,
    quiz: { type: String, required: true },

    title: { type: String, required: true, default: "New Question" },
    type: {
      type: String,
      enum: ["MULTIPLE_CHOICE", "TRUE_FALSE", "FILL_IN_BLANK"],
      default: "MULTIPLE_CHOICE",
    },

    points: { type: Number, default: 1 },
    questionText: { type: String, default: "" },

    choices: [{ type: String }],
    correctChoice: { type: Number, default: 0 },

    trueFalseAnswer: { type: Boolean, default: true },

    blankAnswers: [{ type: String }],
  },
  { collection: "questions" }
);

export default questionSchema;