import { Link } from "react-router-dom";
import { useContext } from "react";
import { useTodos } from "../hooks/useTodos.js";
import Card from "../components/Card.jsx";
import todoIcon from "../assets/todo.png";
import { PanelCtx } from "../App.jsx";

export default function AllTodosPage() {
  const { todos } = useTodos();             // API-Hook statt SessionState
  const { setPanel } = useContext(PanelCtx);

  return (
    <section>
      <h1>All Todos</h1>

      <ul className="grid auto-fill">
        {todos.map((t) => (
          <li key={t.id}>
            <Link to={`/todos/${t.projectId}`}>
              <Card
                className="view-only"
                infoIcon={todoIcon}
                onInfo={(e) => {
                  e.preventDefault();              // Link verhindern
                  setPanel({ type: "todo", data: t }); // Info anzeigen
                }}
              >
                {t.title}
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
