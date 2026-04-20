import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";

import Lab5 from "./Lab5/index.js";
import db from "./Kambaz/database-js/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/courses/routes.js";
import ModulesRoutes from "./Kambaz/modules/routes.js";
import AssignmentRoutes from "./Kambaz/assignments/routes.js";
import EnrollmentRoutes from "./Kambaz/enrollments/routes.js";
import QuizzesRoutes from "./Kambaz/quizzes/routes.js";
import QuestionsRoutes from "./Kambaz/questions/routes.js";
import AttemptsRoutes from "./Kambaz/attempts/routes.js";

const CONNECTION_STRING =
  process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";
mongoose.connect(CONNECTION_STRING);

const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  })
);

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
};

if (process.env.SERVER_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    domain: process.env.SERVER_URL,
  };
}

app.use(session(sessionOptions));
app.use(express.json());

UserRoutes(app, db);
CourseRoutes(app, db);
ModulesRoutes(app, db);
AssignmentRoutes(app, db);
EnrollmentRoutes(app, db);
QuizzesRoutes(app, db);
QuestionsRoutes(app, db);
AttemptsRoutes(app, db);
Lab5(app);

app.listen(process.env.PORT || 4000);