import QuestionsDao from "../questions/dao.js";

export default function QuestionsRoutes(app, db) {
  const dao = QuestionsDao(db);

  const findQuestionsForQuiz = async (req, res) => {
    try {
      const { quizId } = req.params;
      const questions = await dao.findQuestionsForQuiz(quizId);
      res.json(questions);
    } catch (error) {
      console.error("FIND QUESTIONS ERROR:", error);
      res.status(500).json({ message: "Failed to find questions" });
    }
  };

  const findQuestionById = async (req, res) => {
    try {
      const { questionId } = req.params;
      const question = await dao.findQuestionById(questionId);

      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }

      res.json(question);
    } catch (error) {
      console.error("FIND QUESTION ERROR:", error);
      res.status(500).json({ message: "Failed to find question" });
    }
  };

  const createQuestionForQuiz = async (req, res) => {
    try {
      const { quizId } = req.params;
      const newQuestion = await dao.createQuestion(quizId, req.body);

      if (!newQuestion) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      res.json(newQuestion);
    } catch (error) {
      console.error("CREATE QUESTION ERROR:", error);
      res.status(500).json({ message: "Failed to create question" });
    }
  };

  const updateQuestion = async (req, res) => {
    try {
      const { quizId, questionId } = req.params;
      const updatedQuestion = await dao.updateQuestion(
        quizId,
        questionId,
        req.body
      );

      if (!updatedQuestion) {
        return res.status(404).json({ message: "Question not found" });
      }

      res.json(updatedQuestion);
    } catch (error) {
      console.error("UPDATE QUESTION ERROR:", error);
      res.status(500).json({
        message: "Failed to update question",
        error: error.message,
      });
    }
  };

  const deleteQuestion = async (req, res) => {
    try {
      const { quizId, questionId } = req.params;
      const status = await dao.deleteQuestion(quizId, questionId);

      if (!status) {
        return res.status(404).json({ message: "Question not found" });
      }

      res.json(status);
    } catch (error) {
      console.error("DELETE QUESTION ERROR:", error);
      res.status(500).json({ message: "Failed to delete question" });
    }
  };

  app.get("/api/quizzes/:quizId/questions", findQuestionsForQuiz);
  app.get("/api/questions/:questionId", findQuestionById);
  app.post("/api/quizzes/:quizId/questions", createQuestionForQuiz);
  app.put("/api/quizzes/:quizId/questions/:questionId", updateQuestion);
  app.delete("/api/quizzes/:quizId/questions/:questionId", deleteQuestion);
}