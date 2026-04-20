import AttemptsDao from "../attempts/dao.js";

export default function AttemptsRoutes(app, db) {
  const dao = AttemptsDao(db);

  const findAttemptsForQuiz = async (req, res) => {
    const { quizId, userId } = req.params;
    const attempts = await dao.findAttemptsForQuiz(quizId, userId);
    res.json(attempts);
  };

  const findLastAttemptForQuiz = async (req, res) => {
    const { quizId, userId } = req.params;
    const attempt = await dao.findLastAttemptForQuiz(quizId, userId);
    res.json(attempt);
  };

  const submitAttempt = async (req, res) => {
    try {
      const { quizId } = req.params;
      const { userId, answers } = req.body;
      const attempt = await dao.submitAttempt(quizId, userId, answers);
      res.json(attempt);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  };

  app.get("/api/quizzes/:quizId/attempts/:userId", findAttemptsForQuiz);
  app.get("/api/quizzes/:quizId/attempts/:userId/last", findLastAttemptForQuiz);
  app.post("/api/quizzes/:quizId/attempts", submitAttempt);
}