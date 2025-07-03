import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useFoldersContext } from "../context/FoldersContext.jsx";
import { useProjectsContext } from "../context/ProjectsContext.jsx";
import { useTodosContext } from "../context/TodosContext.jsx";
import FolderFormModal from "../components/FolderFormModal.jsx";
import Card from "../components/Card.jsx";
import InfoModal from "../components/InfoModal.jsx";
import folderIcon from "../assets/folder.png";

export default function FolderPage() {
  const navigate = useNavigate();
  const { folders, add, update, remove, reload } = useFoldersContext();
  const { reload: reloadProjects, projects } = useProjectsContext();
  const { reload: reloadTodos, todos } = useTodosContext();

  const [modal, setModal] = useState(null);
  const [info, setInfo] = useState(null);

  /* ---------- SAVE ---------- */
  const save = async (f) => {
    f.id ? await update(f.id, f) : await add(f);
    setModal(null);
  };

  /* ---------- DELETE ---------- */
  const deleteCascade = async (folderId) => {
  const orphanProjects = projects.filter((p) => String(p.folderId) === String(folderId));
  const projIds = orphanProjects.map((p) => p.id);
  const orphanTodos = todos.filter((t) => projIds.includes(t.projectId));

  const ok = window.confirm(
    `Delete folder?\n\n` +
      `This will also remove:\n• ${orphanProjects.length} project(s)\n• ${orphanTodos.length} todo(s)\n\n` +
      `Tip: Move projects elsewhere before deleting, if needed.`
  );
  if (!ok) return;

  await remove(folderId);

  // 🔄 explizit alle abhängigen States neu laden
  await reloadProjects();
  await reloadTodos();
  };

  return (
    <section>
      <h1>Folders</h1>

      <ul className="grid auto-fill">
        {folders.map((f) => (
          <li key={f.id} className="card-wrapper">
            <Card
              className="view-only"
              onClick={() => navigate(`/projects/${f.id}`)}
              onInfo={() => setInfo(f)}
              infoIcon={folderIcon}
            >
              {f.title}
            </Card>

            {/* Buttons jetzt außerhalb der Card */}
            <div className="card-buttons">
              <button onClick={() => deleteCascade(f.id)}>Delete</button>
              <button onClick={() => setModal(f)}>Change</button>
            </div>
          </li>
        ))}
        <li className="card-wrapper">
          <Card className="add" onClick={() => setModal({})}>
            + Add Folder
          </Card>
        </li>
      </ul>

      {modal && (
        <FolderFormModal
          initial={modal.id ? modal : null}
          onSave={save}
          onClose={() => setModal(null)}
        />
      )}

      {info && (
        <InfoModal
          title="Folder info"
          data={{ Title: info.title, Description: info.description }}
          onClose={() => setInfo(null)}
        />
      )}
    </section>
  );
}
