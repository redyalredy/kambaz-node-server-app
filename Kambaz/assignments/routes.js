import AssignmentsDao from "./dao.js";

export default function AssignmentRoutes(app, db) {
  const dao = AssignmentsDao(db);

  const findAssignmentsForCourse = (req, res) => {
    const { courseId } = req.params;
    const assignments = dao.findAssignmentsForCourse(courseId);
    res.json(assignments);
  };

  const findAssignmentById = (req, res) => {
    const { assignmentId } = req.params;
    const assignment = dao.findAssignmentById(assignmentId);
    if (!assignment) {
      res.status(404).json({ message: `Assignment ${assignmentId} not found` });
      return;
    }
    res.json(assignment);
  };

  const createAssignmentForCourse = (req, res) => {
    const { courseId } = req.params;
    const newAssignment = dao.createAssignment({
      ...req.body,
      course: courseId,
    });
    res.json(newAssignment);
  };

  const updateAssignment = (req, res) => {
    const { assignmentId } = req.params;
    const updated = dao.updateAssignment(assignmentId, req.body);
    if (!updated) {
      res.status(404).json({ message: `Assignment ${assignmentId} not found` });
      return;
    }
    res.json(updated);
  };

  const deleteAssignment = (req, res) => {
    const { assignmentId } = req.params;
    const deleted = dao.deleteAssignment(assignmentId);
    if (!deleted) {
      res.status(404).json({ message: `Assignment ${assignmentId} not found` });
      return;
    }
    res.sendStatus(200);
  };

  app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
  app.get("/api/assignments/:assignmentId", findAssignmentById);
  app.post("/api/courses/:courseId/assignments", createAssignmentForCourse);
  app.put("/api/assignments/:assignmentId", updateAssignment);
  app.delete("/api/assignments/:assignmentId", deleteAssignment);
}