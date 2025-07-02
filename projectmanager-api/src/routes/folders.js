import { Router } from "express";
import { db } from "../models/db.js";

const r = Router();

/* ───── GET /api/folders ───── */
r.get("/", async (req, res) => {
  try {
    const folders = await db("folders");
    res.json(folders);
  } catch (err) {
    console.error("GET /folders", err.message);
    res.status(500).json({ error: "Serverfehler" });
  }
});

/* ───── GET /api/folders/:id ───── */
r.get("/:id", async (req, res) => {
  try {
    const folder = await db("folders").where({ id: req.params.id }).first();
    return folder ? res.json(folder) : res.sendStatus(404);
  } catch (err) {
    console.error("GET /folders/:id", err.message);
    res.status(500).json({ error: "Serverfehler" });
  }
});

/* ───── POST /api/folders ───── */
r.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description)
      return res.status(400).json({ error: "title & description required" });

    const [id] = await db("folders").insert({ title, description });
    const newFolder = await db("folders").where({ id }).first();
    res.status(201).json(newFolder);
  } catch (err) {
    console.error("POST /folders", err.message);
    res.status(500).json({ error: "Serverfehler" });
  }
});

/* ───── PUT /api/folders/:id ───── */
r.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const folder = await db("folders").where({ id }).first();
    if (!folder) return res.sendStatus(404);

    await db("folders").where({ id }).update(req.body);
    const updated = await db("folders").where({ id }).first();
    res.json(updated);
  } catch (err) {
    console.error("PUT /folders/:id", err.message);
    res.status(500).json({ error: "Serverfehler" });
  }
});

/* ───── DELETE /api/folders/:id ───── */
r.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await db("folders").where({ id }).del();
    res.sendStatus(204);
  } catch (err) {
    console.error("DELETE /folders/:id", err.message);
    res.status(500).json({ error: "Serverfehler" });
  }
});

export default r;
