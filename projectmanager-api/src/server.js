import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors    from "cors";

import folderRoutes  from "./routes/folders.js";
import projectRoutes from "./routes/projects.js";
import todoRoutes    from "./routes/todos.js";
import gptRouter from "./routes/gpt.js";

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));   // Frontend-URL
app.use(express.json());

app.use("/api/folders",  folderRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/todos",    todoRoutes);
app.use("/api/gpt", gptRouter);

app.listen(4000, () => console.log("API läuft auf http://localhost:4000"));
