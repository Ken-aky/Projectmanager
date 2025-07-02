import { useState } from "react";
import { useTodos } from "../hooks/useTodos.js";         // ✅ API-Daten
import { useSessionState } from "../hooks/useSessionState.js";
import TodoCard from "../components/TodoCard.jsx";
import ReplaceTodoModal from "../components/ReplaceTodoModal.jsx";
import Card from "../components/Card.jsx";

export default function TodayPage() {
  const { todos, reload } = useTodos();                 // ✅ aus API laden
  const [todayIds, setTodayIds] = useSessionState("todayTodoIds", []);
  const [modal, setModal] = useState({ open: false, index: -1 });

  const mapped = todayIds
    .map((id) => todos.find((t) => t.id === id))
    .filter(Boolean)
    .sort((a, b) => Number(a.done) - Number(b.done));

  const remove = (id) => {
    const ok = window.confirm(
      "Remove this todo from Today?\n\nIt will stay in its original project."
    );
    if (ok) setTodayIds(todayIds.filter((tid) => tid !== id));
  };

  const toggleDone = async (id) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    await fetch(`http://localhost:4000/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !todo.done }),
    });
    reload(); // API-Reload
  };

  const replace = (index) => setModal({ open: true, index });

  const onSelect = (todoId) => {
    if (modal.index === -1) setTodayIds([...todayIds, todoId]);
    else {
      const next = [...todayIds];
      next[modal.index] = todoId;
      setTodayIds(next);
    }
    setModal({ open: false, index: -1 });
  };

  return (
    <section>
      <h1>Today</h1>
      <ul className="grid auto-fill">
        {mapped.map((t, i) => (
          <li key={t.id}>
            <TodoCard
              title={t.title}
              done={t.done}
              onToggle={() => toggleDone(t.id)}
              onDelete={() => remove(t.id)}
              onEdit={() => replace(i)}
            />
          </li>
        ))}
        <li>
          <Card
            className="add"
            onClick={() => setModal({ open: true, index: -1 })}
          >
            + Add To dos
          </Card>
        </li>
      </ul>

      {modal.open && (
        <ReplaceTodoModal
          excludeIds={todayIds}
          onSelect={onSelect}
          onClose={() => setModal({ open: false, index: -1 })}
        />
      )}
    </section>
  );
}
