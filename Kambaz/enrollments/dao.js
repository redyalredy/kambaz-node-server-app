import { v4 as uuidv4 } from "uuid";

export default function EnrollmentsDao(db) {
  const findEnrollmentsForUser = (userId) =>
    db.enrollments.filter((enrollment) => enrollment.user === userId);

  const findCoursesForUser = (userId) =>
    db.courses.filter((course) =>
      db.enrollments.some(
        (enrollment) =>
          enrollment.user === userId && enrollment.course === course._id
      )
    );

  const enrollUserInCourse = (userId, courseId) => {
    const alreadyEnrolled = db.enrollments.some(
      (enrollment) =>
        enrollment.user === userId && enrollment.course === courseId
    );
    if (alreadyEnrolled) return null;

    const newEnrollment = {
      _id: uuidv4(),
      user: userId,
      course: courseId,
    };
    db.enrollments = [...db.enrollments, newEnrollment];
    return newEnrollment;
  };

  const unenrollUserFromCourse = (userId, courseId) => {
    const exists = db.enrollments.some(
      (enrollment) =>
        enrollment.user === userId && enrollment.course === courseId
    );
    if (!exists) return false;

    db.enrollments = db.enrollments.filter(
      (enrollment) =>
        !(enrollment.user === userId && enrollment.course === courseId)
    );
    return true;
  };

  return {
    findEnrollmentsForUser,
    findCoursesForUser,
    enrollUserInCourse,
    unenrollUserFromCourse,
  };
}