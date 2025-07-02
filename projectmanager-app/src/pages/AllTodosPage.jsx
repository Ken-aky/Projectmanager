import { Link } from "react-router-dom";
import { useContext } from "react";
import { useTodosContext } from "../context/TodosContext.jsx"; // ⬅️ Neuer Import
import Card from "../components/Card.jsx";
import todoIcon from "../assets/todo.png";
import { PanelCtx } from "../App.jsx";

export default function AllTodosPage() {
  const { todos } = useTodosContext(); // ⬅️ Globaler State
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
                  e.preventDefault();
                  setPanel({ type: "todo", data: t });
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
