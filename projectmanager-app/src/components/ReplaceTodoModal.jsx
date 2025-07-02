import { useState } from "react";
import ModalBase from "./ModalBase";
import { useTodos } from "../hooks/useTodos.js"; // ⬅️ Statt useSessionState

export default function ReplaceTodoModal({ excludeIds = [], onSelect, onClose }) {
  const { todos } = useTodos(); // ⬅️ Backend-Daten laden
  const [query, setQuery] = useState("");

  const filtered = todos.filter((t) =>
    excludeIds.includes(t.id)
      ? false
      : t.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <ModalBase title="Select Todo" onClose={onClose}>
      <input
        type="text"
        placeholder="Search…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul className="todo-select-list">
        {filtered.map((t) => (
          <li key={t.id}>
            <button onClick={() => onSelect(t.id)}>{t.title}</button>
          </li>
        ))}
        {filtered.length === 0 && <li className="empty">No match</li>}
      </ul>
    </ModalBase>
  );
}
