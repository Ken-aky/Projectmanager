# 🧠 Project Manager – GPT-gestützter Aufgabenplaner

Ein übersichtliches Projekt- und Aufgabenmanagement-Tool mit smarter Tagesplanung per GPT (LLaMA 3 via OpenRouter).

## 🚀 Features

- Struktur: **Ordner → Projekte → To-dos**
- Jedes To-do mit: Titel, Prio, Beschreibung, Fälligkeit, Aufwand (Effort)
- **Tagesübersicht**: Aufgaben auswählen oder automatisch generieren lassen
- **GPT-Integration**: Intelligente Auswahl offener To-dos basierend auf Aufwand, Fälligkeit, Priorität
- Kontextbasierter State via **React Context**
- SQLite-Datenbank mit Knex.js
- Responsive UI, modale Formulare, Info-Ansichten

---

## 🧰 Tech Stack

| Bereich     | Technologie            |
|-------------|------------------------|
| Frontend    | React (Vite), CSS      |
| Backend     | Node.js, Express       |
| Datenbank   | SQLite + Knex.js       |
| KI          | LLaMA 3 (via OpenRouter) |

---

## 🛠️ Lokale Einrichtung

### 1. Projekt klonen

```bash
git clone https://github.com/dein-nutzername/projectmanager.git
cd projectmanager
````

### 2. Backend starten

```bash
cd projectmanager-api
npm install
cp .env.example .env
```

> Öffne anschließend die Datei `.env` und füge deinen OpenRouter API-Key ein:

```
OPENROUTER_API_KEY=sk-or-...
```

> ✅ Den Key bekommst du kostenlos unter: [https://openrouter.ai/](https://openrouter.ai/)

Dann starten:

```bash
npm run dev
```

→ Läuft unter: `http://localhost:4000`

---

### 3. Frontend starten

```bash
cd ../projectmanager-frontend
npm install
npm run dev
```

→ Läuft unter: `http://localhost:5173`

---

## ⚙️ API-Key konfigurieren

Die GPT-Integration funktioniert nur mit einem gültigen API-Key von [OpenRouter.ai](https://openrouter.ai/).

1. Erstelle einen kostenlosen Account.
2. Gehe zu deinem [API-Dashboard](https://openrouter.ai/keys).
3. Kopiere deinen persönlichen Key.
4. Füge ihn in `.env` im Backend ein:

```env
OPENROUTER_API_KEY=sk-or-dein-key-hier
```

### Optional: SQLite-Datei ansehen
Um dir die Datenbank grafisch anzuschauen, kannst du die VS Code Extension „SQLite Viewer“ oder das Tool DB Browser for SQLite nutzen:

Visual Studio Code
Extension installieren: SQLite Viewer oder SQLite

projectmanager.db im VS Code öffnen

Tabellen & Inhalte visuell inspizieren
