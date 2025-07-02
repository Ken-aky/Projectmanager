import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useFolders } from "../hooks/useFolders.js";
import { useProjects } from "../hooks/useProjects.js";
import { useTodos } from "../hooks/useTodos.js";
import FolderFormModal from "../components/FolderFormModal.jsx";
import Card from "../components/Card.jsx";
import InfoModal from "../components/InfoModal.jsx";
import folderIcon from "../assets/folder.png";

export default function FolderPage() {
  const navigate = useNavigate();
  const { folders, add, update, remove, reload } = useFolders();
  const { projects } = useProjects();
  const { todos } = useTodos();

  const [modal, setModal] = useState(null);
  const [info, setInfo] = useState(null);

  /* ---------- SAVE ---------- */
  const save = async (f) => {
    f.id ? await update(f.id, f) : await add(f);
    await reload(); // ← NEU
    setModal(null);
  };

  /* ---------- DELETE (Warnung + Kaskade) ---------- */
  const deleteCascade = async (folderId) => {
    const orphanProjects = projects.filter((p) => p.folderId === folderId);
    const projIds = orphanProjects.map((p) => p.id);
    const orphanTodos = todos.filter((t) => projIds.includes(t.projectId));

    const ok = window.confirm(
      `Delete folder?\n\n` +
        `This will also remove:\n• ${orphanProjects.length} project(s)\n• ${orphanTodos.length} todo(s)\n\n` +
        `Tip: Move projects elsewhere before deleting, if needed.`
    );
    if (!ok) return;

    // Nur den Ordner löschen – die Kaskade wird im Backend ausgeführt!
    await remove(folderId);
    await reload();
  };

  return (
    <section>
      <h1>Folders</h1>

      <ul className="grid auto-fill">
        {folders.map((f) => (
          <li key={f.id}>
            <Card
              className="view-only"
              onClick={() => navigate(`/projects/${f.id}`)}
              onInfo={() => setInfo(f)}
              infoIcon={folderIcon}
            >
              {f.title}
              <div className="card-buttons" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => deleteCascade(f.id)}>Delete</button>
                <button onClick={() => setModal(f)}>Change</button>
              </div>
            </Card>
          </li>
        ))}
        <li>
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
