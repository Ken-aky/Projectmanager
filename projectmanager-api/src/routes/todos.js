import { Router } from "express";
import { db } from "../models/db.js";

const r = Router();

/* ───── GET /api/todos ───── */
r.get("/", async (req, res) => {
  try {
    const { projectId } = req.query;
    const query = db("todos");
    if (projectId) query.where({ projectId });
    const todos = await query;
    res.json(todos);
  } catch (err) {
    console.error("GET /todos", err.message);
    res.status(500).json({ error: "Serverfehler" });
  }
});

/* ───── GET /api/todos/:id ───── */
r.get("/:id", async (req, res) => {
  try {
    const todo = await db("todos").where({ id: req.params.id }).first();
    return todo ? res.json(todo) : res.sendStatus(404);
  } catch (err) {
    console.error("GET /todos/:id", err.message);
    res.status(500).json({ error: "Serverfehler" });
  }
});

/* ───── POST /api/todos ───── */
r.post("/", async (req, res) => {
  try {
    const { title, priority, projectId, description, dueDate, effort } = req.body;
    if (!title || !priority || !projectId) {
      return res.status(400).json({ error: "title, priority & projectId required" });
    }

    const validEfforts = ["low", "middle", "high"];
    if (effort && !validEfforts.includes(effort)) {
      return res.status(400).json({ error: "Invalid effort value (allowed: low, middle, high)" });
    }

    const [id] = await db("todos").insert({
      title,
      priority,
      description,
      dueDate,
      projectId,
      effort,         
      done: false,
    });


    const newTodo = await db("todos").where({ id }).first();
    res.status(201).json(newTodo);
  } catch (err) {
    console.error("POST /todos", err.message);
    res.status(500).json({ error: "Serverfehler" });
  }
});

/* ───── PUT /api/todos/:id ───── */
r.put("/:id", async (req, res) => {
  try {
    const validEfforts = ["low", "middle", "high"];
    if (req.body.effort && !validEfforts.includes(req.body.effort)) {
      return res.status(400).json({ error: "Invalid effort value (allowed: low, middle, high)" });
    }

    const id = req.params.id;
    if (!id || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "invalid request" });
    }

    await db("todos").where({ id }).update(req.body);
    const updated = await db("todos").where({ id }).first();
    res.json(updated);
  } catch (err) {
    console.error("PUT /todos/:id", err.message);
    res.status(500).json({ error: "Serverfehler" });
  }
});

/* ───── DELETE /api/todos/:id ───── */
r.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await db("todos").where({ id }).del();
    res.sendStatus(204);
  } catch (err) {
    console.error("DELETE /todos/:id", err.message);
    res.status(500).json({ error: "Serverfehler" });
  }
});

export default r;
