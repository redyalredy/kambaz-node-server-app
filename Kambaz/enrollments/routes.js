import EnrollmentsDao from "./dao.js";

export default function EnrollmentRoutes(app, db) {
  const dao = EnrollmentsDao(db);

  const findMyCourses = (req, res) => {
    const currentUser = req.session?.currentUser;
    if (!currentUser) {
      res.status(401).json({ message: "Not signed in" });
      return;
    }
    const courses = dao.findCoursesForUser(currentUser._id);
    res.json(courses);
  };

  const enrollInCourse = (req, res) => {
    const currentUser = req.session?.currentUser;
    if (!currentUser) {
      res.status(401).json({ message: "Not signed in" });
      return;
    }

    const { courseId } = req.params;
    const enrollment = dao.enrollUserInCourse(currentUser._id, courseId);

    if (!enrollment) {
      res.status(400).json({ message: "Already enrolled" });
      return;
    }

    res.json(enrollment);
  };

  const unenrollFromCourse = (req, res) => {
    const currentUser = req.session?.currentUser;
    if (!currentUser) {
      res.status(401).json({ message: "Not signed in" });
      return;
    }

    const { courseId } = req.params;
    const ok = dao.unenrollUserFromCourse(currentUser._id, courseId);

    if (!ok) {
      res.status(404).json({ message: "Enrollment not found" });
      return;
    }

    res.sendStatus(200);
  };

  app.get("/api/users/current/courses", findMyCourses);
  app.post("/api/users/current/courses/:courseId/enrollment", enrollInCourse);
  app.delete("/api/users/current/courses/:courseId/enrollment", unenrollFromCourse);
}