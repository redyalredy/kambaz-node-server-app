import mongoose from "mongoose";
import moduleSchema from "../modules/schema.js";
import quizSchema from "../quizzes/schema.js";

const courseSchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    number: String,
    startDate: String,
    endDate: String,
    department: String,
    credits: Number,
    description: String,
    modules: [moduleSchema],
    quizzes: [quizSchema],
  },
  { collection: "courses" }
);

export default courseSchema;