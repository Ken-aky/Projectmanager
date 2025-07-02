import { useParams } from "react-router-dom";
import { useState } from "react";
import { useTodos } from "../hooks/useTodos.js";
import { useProjects } from "../hooks/useProjects.js";
import { useFolders } from "../hooks/useFolders.js";
import TodoCard from "../components/TodoCard.jsx";
import TodoFormModal from "../components/TodoFormModal.jsx";
import Card from "../components/Card.jsx";
import InfoModal from "../components/InfoModal.jsx";
import todoIcon from "../assets/todo.png";

export default function TodoPage() {
  const { projectId } = useParams();

  const { todos, add, update, remove, reload } = useTodos(projectId); // ✅ mit projectId!
  const { projects } = useProjects();
  const { folders } = useFolders();

  const project = projects.find((p) => p.id === projectId);
  const folder = project ? folders.find((f) => f.id === project.folderId) : null;

  const [modal, setModal] = useState(null);
  const [info, setInfo] = useState(null);

  /* ---------- SAVE ---------- */
  const save = async (t) => {
    t.id
      ? await update(t.id, t)
      : await add({ ...t, projectId, done: false }); // ✅ projectId setzen
    setModal(null);
  };

  /* ---------- DELETE ---------- */
  const del = async (id) => {
    if (window.confirm("Delete this todo?\n\nThis action cannot be undone.")) {
      await remove(id);
    }
  };

  /* ---------- TOGGLE Done ---------- */
  const toggle = async (id) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) await update(id, { ...todo, done: !todo.done });
  };

  return (
    <section>
      <h1>{project ? project.title : "Todos"}</h1>

      <ul className="grid auto-fill">
        {todos
          .sort((a, b) => Number(a.done) - Number(b.done))
          .map((t) => (
            <li key={t.id}>
              <TodoCard
                title={t.title}
                done={t.done}
                onToggle={() => toggle(t.id)}
                onDelete={() => del(t.id)}
                onEdit={() => setModal(t)}
                onInfo={() => setInfo(t)}
                infoIcon={todoIcon}
              />
            </li>
          ))}

        <li>
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
