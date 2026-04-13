import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function CoursesDao(db) {
  function findAllCourses() {
    return model.find({});
  }

  function createCourse(course) {
    const newCourse = {
      ...course,
      _id: uuidv4(),
      modules: [],
    };
    return model.create(newCourse);
  }

  function deleteCourse(courseId) {
    return model.deleteOne({ _id: courseId });
  }

  function updateCourse(courseId, courseUpdates) {
    const safeUpdates = {
      name: courseUpdates.name,
      number: courseUpdates.number,
      startDate: courseUpdates.startDate,
      endDate: courseUpdates.endDate,
      department: courseUpdates.department,
      credits: courseUpdates.credits,
      description: courseUpdates.description,
    };

    return model.updateOne({ _id: courseId }, { $set: safeUpdates });
  }

  return {
    findAllCourses,
    createCourse,
    deleteCourse,
    updateCourse,
  };
}