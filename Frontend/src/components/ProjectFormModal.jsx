import ModalBase from "./ModalBase.jsx";
import { useState } from "react";
import { useFoldersContext } from "../context/FoldersContext.jsx";          // Folder-Dropdown bleibt lokal
import { useProjectsContext } from "../context/ProjectsContext.jsx"; // ⬅️ globaler Project-Context

export default function ProjectFormModal({ folderId, initial, onClose }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [selectedFolder, setSelectedFolder] = useState(folderId);

  const { folders } = useFoldersContext();
  const { add, update } = useProjectsContext(); // ⬅️ globaler Zugriff auf Projekte

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = { title, description, folderId: selectedFolder };
    if (initial?.id) await update(initial.id, data);
    else await add(data);
    onClose();
  };

  return (
    <ModalBase title={initial ? "Edit Project" : "New Project"} onClose={onClose}>
      <form onSubmit={onSubmit}>
        <label>
          Folder*
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            required
          >
            {folders.map((f) => (
              <option key={f.id} value={f.id}>
                {f.title}
              </option>
            ))}
          </select>
        </label>

        <label>
          Title*
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          Description*
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>

        <div className="modal-buttons">
          <button type="button" className="secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit">Save</button>
        </div>
      </form>
    </ModalBase>
  );
}
