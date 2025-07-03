import { useParams } from "react-router-dom";
import { useState } from "react";
import { useTodosContext } from "../context/TodosContext.jsx";
import { useProjectsContext } from "../context/ProjectsContext.jsx";
import { useFoldersContext } from "../context/FoldersContext.jsx";
import TodoCard from "../components/TodoCard.jsx";
import TodoFormModal from "../components/TodoFormModal.jsx";
import Card from "../components/Card.jsx";
import InfoModal from "../components/InfoModal.jsx";
import todoIcon from "../assets/todo.png";

export default function TodoPage() {
  const { projectId } = useParams();

  const { todos, add, update, remove } = useTodosContext();
  const { projects } = useProjectsContext();
  const { folders } = useFoldersContext();

  const project = projects.find((p) => String(p.id) === projectId);
  const folder = project ? folders.find((f) => String(f.id) === String(project.folderId)) : null;

  const [modal, setModal] = useState(null);
  const [info, setInfo] = useState(null);

  const filteredTodos = todos
    .filter((t) => String(t.projectId) === projectId)
    .sort((a, b) => Number(a.done) - Number(b.done));

  const save = async (t) => {
    t.id
      ? await update(t.id, t)
      : await add({ ...t, projectId, done: false });
    setModal(null);
  };

  const del = async (id) => {
    if (window.confirm("Delete this todo?\n\nThis action cannot be undone.")) {
      await remove(id);
    }
  };

  const toggle = async (id) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) await update(id, { ...todo, done: !todo.done });
  };

  return (
    <section>
      <h1 style={{ textAlign: "center" }}>
        {project?.title ? `${project.title} – Todos` : "Todos"}
      </h1>

      <ul className="grid auto-fill">
        {filteredTodos.map((t) => (
          <li key={t.id} className="card-wrapper">
            <TodoCard
              title={t.title}
              effort={t.effort}  
              done={t.done}
              onToggle={() => toggle(t.id)}
              onInfo={() => setInfo(t)}
              infoIcon={todoIcon}
            />

            <div className="todo-buttons">
              <button onClick={() => del(t.id)}>Delete</button>
              <button onClick={() => setModal(t)}>Change</button>
            </div>
          </li>
        ))}

        <li className="card-wrapper">
          <Card className="add" onClick={() => setModal({})}>
            + Add todo
          </Card>
        </li>
      </ul>

      {modal && (
        <TodoFormModal
          projectId={projectId}
          initial={modal.id ? modal : null}
          onSave={save}
          onClose={() => setModal(null)}
        />
      )}

      {info && (
        <InfoModal
          title="Todo info"
          data={{
            Title: info.title,
            Effort: info.effort, // 🆕 effort in Info-Modal anzeigen
            Priority: info.priority,
            Description: info.description,
            "Due date": info.dueDate,
            Project: project?.title,
            Folder: folder?.title,
          }}
          onClose={() => setInfo(null)}
        />
      )}
    </section>
  );
}
