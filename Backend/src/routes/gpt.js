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
        .filter((t) => !t.done)
        .map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          priority: t.priority,
          dueDate: t.dueDate,
          effort: t.effort,
          done: false,
        })),
    };

    const prompt = `
    Du bist ein intelligenter Task-Planer.

    🔍 Ziel: Wähle aus den offenen To-dos eine **sinnvolle Auswahl für heute**, die realistisch machbar ist – basierend auf:

    📌 **Priorität**
    - high = bevorzugt auswählen
    - medium = ergänzend
    - low = optional

    ⏰ **Fälligkeitsdatum**
    - Überfällig oder heute = sehr wichtig
    - In 1–2 Tagen = mittel
    - Später oder kein Datum = niedrig priorisieren

    💪 **Aufwand (effort)**
    - high = sehr aufwendig → max. 1–2 Stück
    - medium = normal → einige erlaubt
    - low = leicht → mehrere erlaubt

    🧠 **Erstelle eine sinnvolle Mischung**, z. B.:
    - 1 aufwendige Aufgabe (effort: high)
    - 2–3 normale (effort: medium)
    - mehrere kleine (effort: low)

    ⚠️ Verwende **keine Platzhalter** wie "..." oder "string" oder "null" als Text.
    Wenn du keine Beschreibung hast, setze einfach ein leeres Feld: "".

    🔹 **Antwortformat (Pflicht):**
    [
      {
        "id": "EXAKT wie oben in der Todo-Liste",
        "title": "...",
        "description": "...",
        "priority": "low | medium | high",
        "dueDate": "YYYY-MM-DD" oder "",
        "effort": "low | middle | high",
        "done": false
      }
    ]

    🔐 Gib **nur gültiges JSON** zurück – ohne Einleitung, ohne Formatierung, ohne \`\`\`, ohne Kommentare.

    📊 Daten:

    Projekte:
    ${context.projects.map((p) => `- ${p.title}: ${p.description}`).join("\n")}

    Offene To-dos:
    ${context.todos.map((t) =>
      `- ${t.id}: ${t.title} | Prio: ${t.priority} | Due: ${t.dueDate ?? "—"} | Effort: ${t.effort ?? "—"}`
    ).join("\n")}
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
