import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useProjectsContext } from "../context/ProjectsContext.jsx";
import { useTodosContext } from "../context/TodosContext.jsx";
import { useFoldersContext } from "../context/FoldersContext.jsx";
import ProjectFormModal from "../components/ProjectFormModal.jsx";
import Card from "../components/Card.jsx";
import InfoModal from "../components/InfoModal.jsx";
import projectIcon from "../assets/project.png";

export default function ProjectPage() {
  const { folderId } = useParams();
  const navigate = useNavigate();

  const { projects, add, update, remove } = useProjectsContext();
  const { todos, reload: reloadTodos } = useTodosContext();
  const { folders } = useFoldersContext();

  const filteredProjects = projects.filter((p) => String(p.folderId) === folderId);
  const folder = folders.find((f) => String(f.id) === folderId);

  const [modal, setModal] = useState(null);
  const [info, setInfo] = useState(null);

  /* ---------- SAVE ---------- */
  const save = async (p) => {
    p.id
      ? await update(p.id, p)
      : await add({ ...p, folderId }); // ✅ folderId ergänzen
    setModal(null);
  };

  /* ---------- DELETE ---------- */
  const deleteCascade = async (projectId) => {
  const orphanTodos = todos.filter((t) => t.projectId === projectId);

  const ok = window.confirm(
    `Delete project?\n\n` +
      `This will also remove ${orphanTodos.length} todo(s).\n\n` +
      `Tip: Move todos elsewhere before deleting, if needed.`
  );
  if (!ok) return;

  await remove(projectId);
  await reloadTodos(); // 🔄 Todos neu laden nach dem Löschen
  };


  return (
    <section>
      <h1>{folder?.title ? `${folder.title} – Projects` : "Projects"}</h1>

      <ul className="grid auto-fill">
      {filteredProjects.map((p) => (
        <li key={p.id}>
          <Card
            className="view-only"
            onClick={() => navigate(`/todos/${p.id}`)}
            onInfo={() => setInfo(p)}
            infoIcon={projectIcon}
          >
            {p.title}
            <div
              className="card-buttons"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => deleteCascade(p.id)}>Delete</button>
              <button onClick={() => setModal(p)}>Change</button>
            </div>
          </Card>
        </li>
      ))}

        <li>
          <Card className="add" onClick={() => setModal({})}>
            + Add Project
          </Card>
        </li>
      </ul>

      {modal && (
        <ProjectFormModal
          folderId={folderId}
          initial={modal.id ? modal : null}
          onSave={save}
          onClose={() => setModal(null)}
        />
      )}

      {info && (
        <InfoModal
          title="Project info"
          data={{
            Title: info.title,
            Description: info.description,
            Folder: folder?.title,
          }}
          onClose={() => setInfo(null)}
        />
      )}
    </section>
  );
}
