import QuizzesDao from "./dao.js";

export default function QuizzesRoutes(app, db) {
  const dao = QuizzesDao(db);

  const findQuizzesForCourse = async (req, res) => {
    const { courseId } = req.params;
    const quizzes = await dao.findQuizzesForCourse(courseId);
    res.json(quizzes);
  };

  const findQuizById = async (req, res) => {
    const { quizId } = req.params;
    const quiz = await dao.findQuizById(quizId);
    res.json(quiz);
  };

  const createQuizForCourse = async (req, res) => {
    const { courseId } = req.params;
    const quiz = {
      ...req.body,
    };
    const newQuiz = await dao.createQuiz(courseId, quiz);
    res.send(newQuiz);
  };

  const deleteQuiz = async (req, res) => {
    const { courseId, quizId } = req.params;
    const status = await dao.deleteQuiz(courseId, quizId);
    res.send(status);
  };

  const updateQuiz = async (req, res) => {
    const { quizId } = req.params;
    const quizUpdates = req.body;
    const status = await dao.updateQuiz(quizId, quizUpdates);
    res.send(status);
  };

  const publishQuiz = async (req, res) => {
    const { quizId } = req.params;
    const status = await dao.publishQuiz(quizId);
    res.send(status);
  };

  const unpublishQuiz = async (req, res) => {
    const { quizId } = req.params;
    const status = await dao.unpublishQuiz(quizId);
    res.send(status);
  };

  app.get("/api/courses/:courseId/quizzes", findQuizzesForCourse);
  app.get("/api/quizzes/:quizId", findQuizById);
  app.post("/api/courses/:courseId/quizzes", createQuizForCourse);
  app.delete("/api/courses/:courseId/quizzes/:quizId", deleteQuiz);
  app.put("/api/courses/:courseId/quizzes/:quizId", updateQuiz);
  app.put("/api/quizzes/:quizId/publish", publishQuiz);
  app.put("/api/quizzes/:quizId/unpublish", unpublishQuiz);
}