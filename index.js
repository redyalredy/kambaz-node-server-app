import express from 'express';
import Lab5 from "./Lab5/index.js";
import cors from "cors";
import * as db from "./Kambaz/database-js/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
const app = express()
app.use(cors());  
app.use(express.json());
UserRoutes(app, db);
Lab5(app);

app.listen(process.env.PORT || 4000)