import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    _id: String,
    title: String,
    description: String,
    course: { type: String, ref: "CourseModel" },
    points: Number,
    dueDate: String,
    availableFrom: String,
    availableUntil: String,
    group: String,
    gradeDisplay: String,
    submissionType: String,
  },
  { collection: "assignments" }
);

export default schema;