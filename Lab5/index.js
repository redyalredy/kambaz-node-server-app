import PathParameters from "./PathParameters.js";
import Hello from "../Hello.js";
import QueryParameters from "./QueryParameters.js";
import WorkingWithObjects from "./WorkingWithObjects.js";
import WorkingWithArrays from "./WorkingWithArrays.js";

export default function Lab5(app) {
    app.get("/lab5/welcome", (req, res) => {
      res.send("Welcome to Lab 5");
    });
      PathParameters(app);
      Hello(app)
QueryParameters(app);
WorkingWithObjects(app);
WorkingWithArrays(app);

  }