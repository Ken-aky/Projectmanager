import ModalBase from "./ModalBase.jsx";
import { useState } from "react";
import { useTodosContext } from "../context/TodosContext.jsx"; // ⬅️ ersetzt useTodos
import { useProjects } from "../hooks/useProjects.js";

export default function TodoFormModal({ projectId, initial, onClose }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [priority, setPriority] = useState(initial?.priority ?? "medium");
  const [description, setDesc] = useState(initial?.description ?? "");
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? "");
  const [targetProject, setTargetProject] = useState(projectId);

  const { add, update } = useTodosContext();     // ⬅️ globaler State
  const { projects } = useProjects();

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = {
      title,
      priority,
      description,
      dueDate,
      projectId: targetProject,
    };
    if (initial?.id) await update(initial.id, data);
    else await add(data);
    onClose();
  };

  return (
    <ModalBase title={initial ? "Edit Todo" : "New Todo"} onClose={onClose}>
      <form onSubmit={onSubmit}>
        <label>
          Project*
          <select
            value={targetProject}
            onChange={(e) => setTargetProject(e.target.value)}
            required
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </label>

        <label>
          Title*
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>

        <label>
          Priority*
          <select value={priority} onChange={(e) => setPriority(e.target.value)} required>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <label>
          Description
          <textarea value={description} onChange={(e) => setDesc(e.target.value)} />
        </label>

        <label>
          Due date
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </label>

        <div className="modal-buttons">
          <button type="button" className="secondary" onClick={onClose}>Cancel</button>
          <button type="submit">Save</button>
        </div>
      </form>
    </ModalBase>
  );
}
