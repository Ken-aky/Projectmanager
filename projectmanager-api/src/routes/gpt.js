import express from "express";
import { db } from "../models/db.js";
import fetch from "node-fetch";

const router = express.Router();

router.post("/suggestions", async (req, res) => {
  console.log("📦 API KEY:", process.env.OPENROUTER_API_KEY);

  try {
    const projects = await db("projects").select();
    const todos = await db("todos").select();

    const context = {
      projects: projects.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
      })),
      todos: todos
        .filter((t) => !t.done) // ✅ Nur offene Todos
        .map((t) => ({
          id: t.id,
          title: t.title,
          priority: t.priority,
          dueDate: t.dueDate,
        })),
    };

    const prompt = `
Ich bin ein smarter Tagesplaner. 
Basierend auf folgenden Projekten und offenen To-dos soll ich **genau 3** sinnvolle Aufgaben für heute vorschlagen.

Projekte:
${context.projects.map((p) => `- ${p.title}: ${p.description}`).join("\n")}

Offene To-dos:
${context.todos.map((t) => `- ${t.title} (${t.priority})`).join("\n")}

Gib das Ergebnis als JSON-Array mit exakt diesen Feldern zurück:

[
  {
    "id": "...",
    "title": "...",
    "description": "...",
    "priority": "...",
    "dueDate": "...",
    "done": false
  }
]

Gib **nur** gültiges JSON zurück – ohne Einleitung, ohne Formatierung, ohne Kommentare.
`;

    const openrouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await openrouterRes.json();
    const text = data.choices?.[0]?.message?.content;

    console.log("🔎 GPT RAW TEXT:\n", text);

    try {
      // Versuche, JSON aus der Antwort zu extrahieren
      const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const jsonString = match ? match[1] : text;

      const suggestions = JSON.parse(jsonString);

      if (!Array.isArray(suggestions)) {
        throw new Error("Antwort ist kein gültiges Array");
      }

      res.json(suggestions);
    } catch (parseErr) {
      console.error("❌ JSON-Parsing fehlgeschlagen:", parseErr);
      res.status(500).json({
        error: "GPT-Antwort konnte nicht geparsed werden",
        raw: text,
      });
    }
  } catch (err) {
    console.error("GPT Error:", err);
    res.status(500).json({ error: "Failed to get GPT suggestions." });
  }
});

export default router;
