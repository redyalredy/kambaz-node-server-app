import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    _id: String,
    title: String,
    type: String,
    points: Number,
    questionText: String,
    choices: [String],
    correctChoice: Number,
    trueFalseAnswer: Boolean,
    blankAnswers: [String],
  },
  { _id: false }
);

const attemptAnswerSchema = new mongoose.Schema(
  {
    question: String,
    answer: mongoose.Schema.Types.Mixed,
    isCorrect: Boolean,
  },
  { _id: false }
);

const attemptSchema = new mongoose.Schema(
  {
    _id: String,
    user: String,
    attemptNumber: Number,
    score: Number,
    submittedAt: String,
    answers: [attemptAnswerSchema],
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
  {
    _id: String,
    title: String,
    description: String,
    quizType: String,
    assignmentGroup: String,
    shuffleAnswers: Boolean,
    timeLimit: Number,
    multipleAttempts: Boolean,
    howManyAttempts: Number,
    showCorrectAnswers: String,
    accessCode: String,
    oneQuestionAtATime: Boolean,
    webcamRequired: Boolean,
    lockQuestionsAfterAnswering: Boolean,
    dueDate: String,
    availableDate: String,
    untilDate: String,
    published: Boolean,
    points: Number,
    questions: [questionSchema],
    attempts: [attemptSchema],
  },
  { _id: false }
);

export default quizSchema;  