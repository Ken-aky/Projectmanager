import { useState } from "react";
import { useTodos } from "../hooks/useTodos.js";
import { useSessionState } from "../hooks/useSessionState.js";
import TodoCard from "../components/TodoCard.jsx";
import ReplaceTodoModal from "../components/ReplaceTodoModal.jsx";
import Card from "../components/Card.jsx";

export default function TodayPage() {
  const { todos, reload } = useTodos();
  const [todayIds, setTodayIds] = useSessionState("todayTodoIds", []);
  const [modal, setModal] = useState({ open: false, index: -1 });
  const [loading, setLoading] = useState(false);

  const mapped = todayIds
    .map((id) => todos.find((t) => t.id === id))
    .filter(Boolean)
    .sort((a, b) => Number(a.done) - Number(b.done));

  const remove = (id) => {
    const todo = todos.find((t) => t.id === id);
    if (window.confirm("Remove this todo from Today?")) {
      setTodayIds(todayIds.filter((tid) => tid !== id));
    }
  };

  const toggleDone = async (id) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    await fetch(`http://localhost:4000/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !todo.done }),
    });
    reload();
  };

  const replace = (index) => setModal({ open: true, index });

  const onSelect = (todoId) => {
    if (modal.index === -1) {
      setTodayIds([...todayIds, todoId]);
    } else {
      const next = [...todayIds];
      next[modal.index] = todoId;
      setTodayIds(next);
    }
    setModal({ open: false, index: -1 });
  };

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/gpt/suggestions", {
        method: "POST",
      });
      const raw = await res.text();
      const match = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || raw.match(/\[.*\]/s);
      const jsonString = match ? (match[1] || match[0]) : "[]";
      const parsed = JSON.parse(jsonString);
      const titles = parsed
        .map((s) => (typeof s.title === "string" ? s.title.toLowerCase() : null))
        .filter(Boolean);
      const matchingTodos = todos.filter((t) =>
        titles.includes(t.title.toLowerCase())
      );
      const newIds = matchingTodos.map((t) => t.id);
      setTodayIds(newIds);
    } catch (err) {
      console.error("❌ GPT parse error:", err);
      alert("Fehler beim Verarbeiten der GPT-Antwort. Versuche es erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h1>Today</h1>

      <ul className="top-row">
        <li className="card-wrapper">
          <Card className="add" onClick={fetchSuggestions}>
            {loading ? "Generating..." : "Generate from GPT"}
          </Card>
        </li>
        <li className="card-wrapper">
          <Card className="add" onClick={() => setModal({ open: true, index: -1 })}>
            + Add To dos
          </Card>
        </li>
      </ul>

      <ul className="grid auto-fill">
        {mapped.map((t, i) => (
          <li key={t.id} className="card-wrapper">
            <TodoCard
              title={t.title}
              done={t.done}
              onToggle={() => toggleDone(t.id)}
            />
            <div className="todo-buttons">
              <button onClick={() => remove(t.id)}>Delete</button>
              <button onClick={() => replace(i)}>Change</button>
            </div>
          </li>
        ))}
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
