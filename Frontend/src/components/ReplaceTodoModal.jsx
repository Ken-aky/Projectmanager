import ModalBase from "./ModalBase.jsx";
import { useTodos } from "../hooks/useTodos.js";
import { useState } from "react";

export default function ReplaceTodoModal({ excludeIds, onSelect, onClose }) {
  const { todos } = useTodos();
  const [query, setQuery] = useState("");

  const filtered = todos.filter(
    (t) =>
      !t.done && 
      !excludeIds.includes(t.id) &&
      t.title.toLowerCase().includes(query.toLowerCase())
  );


  return (
    <ModalBase title="Select Todo" onClose={onClose}>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          Search…
          <input
            type="text"
            placeholder="Search by title..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>

        <ul className="todo-select-list">
          {filtered.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => onSelect(t.id)}
                className="todo-select-item"
              >
                {t.title}
              </button>
            </li>
          ))}
        </ul>

        <div className="modal-buttons">
          <button type="button" className="secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </ModalBase>
  );
}
