import ModalBase from "./ModalBase";
import { useState } from "react";
import { useFoldersContext } from "../context/FoldersContext.jsx"; // ✅ API-Hook importieren

export default function FolderFormModal({ initial, onClose }) {
  const { add, update } = useFoldersContext();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = { title, description };
    if (initial?.id) await update(initial.id, data);
    else await add(data);
    onClose(); // Modal schließen
  };

  return (
    <ModalBase title={initial ? "Edit Folder" : "New Folder"} onClose={onClose}>
      <form onSubmit={onSubmit}>
        <label>
          Title*
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
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
