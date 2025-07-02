import { Router } from "express";
import { db } from "../models/db.js";

const r = Router();

/* ───── GET /api/projects ───── */
r.get("/", async (req, res) => {
  try {
    const { folderId } = req.query;
    const query = db("projects");
    if (folderId) query.where({ folderId });
    const projects = await query;
    res.json(projects);
  } catch (err) {
    console.error("GET /projects", err.message);
    res.status(500).json({ error: "Serverfehler" });
  }
});

/* ───── GET /api/projects/:id ───── */
r.get("/:id", async (req, res) => {
  try {
    const project = await db("projects").where({ id: req.params.id }).first();
    return project ? res.json(project) : res.sendStatus(404);
  } catch (err) {
    console.error("GET /projects/:id", err.message);
    res.status(500).json({ error: "Serverfehler" });
  }
});

/* ───── POST /api/projects ───── */
r.post("/", async (req, res) => {
  try {
    const { title, description, folderId } = req.body;
    if (!title || !folderId)
      return res.status(400).json({ error: "title & folderId required" });

    const [id] = await db("projects").insert({ title, description, folderId });
    const newProject = await db("projects").where({ id }).first();
    res.status(201).json(newProject);
  } catch (err) {
    console.error("POST /projects", err.message);
    res.status(500).json({ error: "Serverfehler" });
  }
});

/* ───── PUT /api/projects/:id ───── */
r.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await db("projects").where({ id }).update(req.body);
    const updated = await db("projects").where({ id }).first();
    res.json(updated);
  } catch (err) {
    console.error("PUT /projects/:id", err.message);
    res.status(500).json({ error: "Serverfehler" });
  }
});

/* ───── DELETE /api/projects/:id ───── */
r.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Zuerst Todos des Projekts löschen
    await db("todos").where({ projectId: id }).del();

    // Dann das Projekt löschen
    await db("projects").where({ id }).del();

    res.sendStatus(204);
  } catch (err) {
    console.error("DELETE /projects/:id", err.message);
    res.status(500).json({ error: "Serverfehler" });
  }
});

export default r;
