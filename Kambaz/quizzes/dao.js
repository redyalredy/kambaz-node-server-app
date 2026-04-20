import CourseModel from "../courses/model.js";

export default function QuizzesDao(db) {
  async function findQuizzesForCourse(courseId) {
    const course = await CourseModel.findById(courseId);
    return course?.quizzes || [];
  }

  async function findQuizById(quizId) {
    const course = await CourseModel.findOne({ "quizzes._id": quizId });
    if (!course) return null;

    const quiz = course.quizzes.id(quizId);
    return quiz || null;
  }

  async function createQuiz(courseId, quiz) {
    const course = await CourseModel.findById(courseId);
    if (!course) return null;

    const newQuiz = {
      ...quiz,
      _id: quiz._id || new Date().getTime().toString(),
      title: quiz.title || "New Quiz",
      description: quiz.description || "",
      quizType: quiz.quizType || "Graded Quiz",
      assignmentGroup: quiz.assignmentGroup || "Quizzes",
      shuffleAnswers: quiz.shuffleAnswers ?? true,
      timeLimit: quiz.timeLimit ?? 20,
      multipleAttempts: quiz.multipleAttempts ?? false,
      howManyAttempts: quiz.howManyAttempts ?? 1,
      showCorrectAnswers: quiz.showCorrectAnswers || "",
      accessCode: quiz.accessCode || "",
      oneQuestionAtATime: quiz.oneQuestionAtATime ?? true,
      webcamRequired: quiz.webcamRequired ?? false,
      lockQuestionsAfterAnswering: quiz.lockQuestionsAfterAnswering ?? false,
      dueDate: quiz.dueDate || "",
      availableDate: quiz.availableDate || "",
      untilDate: quiz.untilDate || "",
      published: quiz.published ?? false,
      points: 0,
      questions: quiz.questions || [],
      attempts: quiz.attempts || [],
    };

    if (!course.quizzes) {
      course.quizzes = [];
    }

    course.quizzes.push(newQuiz);
    await course.save();
    return newQuiz;
  }

  async function deleteQuiz(courseId, quizId) {
    return await CourseModel.updateOne(
      { _id: courseId },
      { $pull: { quizzes: { _id: quizId } } }
    );
  }

  async function updateQuiz(quizId, quizUpdates) {
    const course = await CourseModel.findOne({ "quizzes._id": quizId });
    if (!course) return null;
  
    const index = (course.quizzes || []).findIndex(
      (q) => String(q._id) === String(quizId)
    );
  
    if (index === -1) return null;
  
    const existingQuiz = course.quizzes[index];
  
    const updatedQuiz = {
      ...existingQuiz,
      ...quizUpdates,
      _id: existingQuiz._id,
  
      questions: existingQuiz.questions || [],
  
      attempts: existingQuiz.attempts || [],
    };
  
    course.quizzes.splice(index, 1, updatedQuiz);
  
    course.markModified("quizzes");
    await course.save();
  
    return updatedQuiz;
  }

  async function publishQuiz(quizId) {
    const course = await CourseModel.findOne({ "quizzes._id": quizId });
    if (!course) return null;

    const quiz = course.quizzes.id(quizId);
    if (!quiz) return null;

    quiz.published = true;
    await course.save();
    return quiz;
  }

  async function unpublishQuiz(quizId) {
    const course = await CourseModel.findOne({ "quizzes._id": quizId });
    if (!course) return null;

    const quiz = course.quizzes.id(quizId);
    if (!quiz) return null;

    quiz.published = false;
    await course.save();
    return quiz;
  }

  return {
    findQuizzesForCourse,
    findQuizById,
    createQuiz,
    deleteQuiz,
    updateQuiz,
    publishQuiz,
    unpublishQuiz,
  };
}