import { v4 as uuidv4 } from "uuid";

export default function AssignmentsDao(db) {
  const findAssignmentsForCourse = (courseId) =>
    db.assignments.filter((assignment) => assignment.course === courseId);

  const findAssignmentById = (assignmentId) =>
    db.assignments.find((assignment) => assignment._id === assignmentId);

  const createAssignment = (assignment) => {
    const newAssignment = { ...assignment, _id: uuidv4() };
    db.assignments = [...db.assignments, newAssignment];
    return newAssignment;
  };

  const updateAssignment = (assignmentId, assignmentUpdates) => {
    const assignment = db.assignments.find((a) => a._id === assignmentId);
    if (!assignment) return null;
    Object.assign(assignment, assignmentUpdates);
    return assignment;
  };

  const deleteAssignment = (assignmentId) => {
    const exists = db.assignments.some((a) => a._id === assignmentId);
    if (!exists) return false;
    db.assignments = db.assignments.filter((a) => a._id !== assignmentId);
    return true;
  };

  return {
    findAssignmentsForCourse,
    findAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  };
}