import CourseModel from "../courses/model.js";

export default function AttemptsDao(db) {
  async function findAttemptsForQuiz(quizId, userId) {
    const course = await CourseModel.findOne({ "quizzes._id": quizId });
    if (!course) return [];

    const quiz = course.quizzes.id(quizId);
    if (!quiz) return [];

    return (quiz.attempts || []).filter((attempt) => attempt.user === userId);
  }

  async function findLastAttemptForQuiz(quizId, userId) {
    const attempts = await findAttemptsForQuiz(quizId, userId);
    return attempts.length > 0 ? attempts[attempts.length - 1] : null;
  }

  async function submitAttempt(quizId, userId, submittedAnswers) {
    const course = await CourseModel.findOne({ "quizzes._id": quizId });
    if (!course) return null;

    const quiz = course.quizzes.id(quizId);
    if (!quiz) return null;

    const existingAttempts = (quiz.attempts || []).filter(
      (attempt) => attempt.user === userId
    );

    if (!quiz.multipleAttempts && existingAttempts.length >= 1) {
      throw new Error("No more attempts allowed");
    }

    if (quiz.multipleAttempts && existingAttempts.length >= quiz.howManyAttempts) {
      throw new Error("Attempt limit reached");
    }

    let score = 0;

    const gradedAnswers = quiz.questions.map((question) => {
      const submitted = submittedAnswers.find((a) => a.question === question._id);
      const answerValue = submitted ? submitted.answer : null;
      let isCorrect = false;

      if (question.type === "MULTIPLE_CHOICE") {
        isCorrect = Number(answerValue) === question.correctChoice;
      } else if (question.type === "TRUE_FALSE") {
        isCorrect = Boolean(answerValue) === question.trueFalseAnswer;
      } else if (question.type === "FILL_IN_BLANK") {
        const normalized = String(answerValue || "").trim().toLowerCase();
        isCorrect = (question.blankAnswers || []).some(
          (a) => String(a).trim().toLowerCase() === normalized
        );
      }

      if (isCorrect) {
        score += question.points || 0;
      }

      return {
        question: question._id,
        answer: answerValue,
        isCorrect,
      };
    });

    const newAttempt = {
      _id: new Date().getTime().toString(),
      user: userId,
      attemptNumber: existingAttempts.length + 1,
      score,
      submittedAt: new Date().toISOString(),
      answers: gradedAnswers,
    };

    if (!quiz.attempts) {
      quiz.attempts = [];
    }

    quiz.attempts.push(newAttempt);
    await course.save();
    return newAttempt;
  }

  return {
    findAttemptsForQuiz,
    findLastAttemptForQuiz,
    submitAttempt,
  };
}