import CourseModel from "../courses/model.js";

export default function QuestionsDao(db) {
  async function findQuestionsForQuiz(quizId) {
    const course = await CourseModel.findOne({ "quizzes._id": quizId }).lean();
    if (!course) return [];

    const quiz = (course.quizzes || []).find(
      (q) => String(q._id) === String(quizId)
    );

    return quiz?.questions || [];
  }

  async function findQuestionById(questionId) {
    const course = await CourseModel.findOne({
      "quizzes.questions._id": questionId,
    }).lean();

    if (!course) return null;

    for (const quiz of course.quizzes || []) {
      const question = (quiz.questions || []).find(
        (q) => String(q._id) === String(questionId)
      );
      if (question) return question;
    }

    return null;
  }

  async function createQuestion(quizId, question) {
    const course = await CourseModel.findOne({ "quizzes._id": quizId });
    if (!course) return null;

    const quiz = (course.quizzes || []).find(
      (q) => String(q._id) === String(quizId)
    );
    if (!quiz) return null;

    const type = question.type || "MULTIPLE_CHOICE";

    const newQuestion = {
      _id: question._id || `${quizId}-${Date.now()}`,
      title: question.title || "New Question",
      type,
      points: Number(question.points ?? 1),
      questionText: question.questionText || "",
      choices:
        type === "MULTIPLE_CHOICE"
          ? question.choices || ["Option 1", "Option 2"]
          : [],
      correctChoice:
        type === "MULTIPLE_CHOICE"
          ? Number(question.correctChoice ?? 0)
          : 0,
      trueFalseAnswer:
        type === "TRUE_FALSE"
          ? question.trueFalseAnswer ?? true
          : true,
      blankAnswers:
        type === "FILL_IN_BLANK"
          ? question.blankAnswers || []
          : [],
    };

    if (!quiz.questions) {
      quiz.questions = [];
    }

    quiz.questions.push(newQuestion);
    quiz.points = quiz.questions.reduce(
      (sum, q) => sum + (Number(q.points) || 0),
      0
    );

    course.markModified("quizzes");
    await course.save();
    return newQuestion;
  }

  async function updateQuestion(quizId, questionId, questionUpdates) {
    const course = await CourseModel.findOne({ "quizzes._id": quizId });
    if (!course) return null;

    const quiz = (course.quizzes || []).find(
      (q) => String(q._id) === String(quizId)
    );
    if (!quiz) return null;

    if (!quiz.questions) {
      quiz.questions = [];
    }

    const index = quiz.questions.findIndex(
      (q) => String(q._id) === String(questionId)
    );

    if (index === -1) return null;

    const current = quiz.questions[index];
    const nextType = questionUpdates.type ?? current.type ?? "MULTIPLE_CHOICE";

    const updatedQuestion = {
      _id: current._id,
      title: questionUpdates.title ?? current.title ?? "New Question",
      type: nextType,
      points: Number(questionUpdates.points ?? current.points ?? 1),
      questionText: questionUpdates.questionText ?? current.questionText ?? "",
      choices:
        nextType === "MULTIPLE_CHOICE"
          ? questionUpdates.choices ?? current.choices ?? ["Option 1", "Option 2"]
          : [],
      correctChoice:
        nextType === "MULTIPLE_CHOICE"
          ? Number(questionUpdates.correctChoice ?? current.correctChoice ?? 0)
          : 0,
      trueFalseAnswer:
        nextType === "TRUE_FALSE"
          ? questionUpdates.trueFalseAnswer ?? current.trueFalseAnswer ?? true
          : true,
      blankAnswers:
        nextType === "FILL_IN_BLANK"
          ? questionUpdates.blankAnswers ?? current.blankAnswers ?? []
          : [],
    };

    quiz.questions.splice(index, 1, updatedQuestion);

    quiz.points = quiz.questions.reduce(
      (sum, q) => sum + (Number(q.points) || 0),
      0
    );

    course.markModified("quizzes");
    await course.save();

    return updatedQuestion;
  }

  async function deleteQuestion(quizId, questionId) {
    const course = await CourseModel.findOne({ "quizzes._id": quizId });
    if (!course) return null;

    const quiz = (course.quizzes || []).find(
      (q) => String(q._id) === String(quizId)
    );
    if (!quiz) return null;

    if (!quiz.questions) {
      quiz.questions = [];
    }

    const index = quiz.questions.findIndex(
      (q) => String(q._id) === String(questionId)
    );

    if (index === -1) return null;

    const deletedQuestion = quiz.questions[index];
    quiz.questions.splice(index, 1);

    quiz.points = quiz.questions.reduce(
      (sum, q) => sum + (Number(q.points) || 0),
      0
    );

    course.markModified("quizzes");
    await course.save();

    return { acknowledged: true, deleted: true, question: deletedQuestion };
  }

  return {
    findQuestionsForQuiz,
    findQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion,
  };
}