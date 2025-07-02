import { useState, useEffect } from "react";
const API = import.meta.env.VITE_API || "http://localhost:4000/api";

export function useTodos(projectId = null) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    try {
      const url = projectId
        ? `${API}/todos?projectId=${projectId}`
        : `${API}/todos`;
      const res = await fetch(url);
      const data = await res.json();
      setTodos(data);
      return data;
    } catch (err) {
      console.error("Failed to load todos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, [projectId]);

  const add = async (data) => {
    await fetch(`${API}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await reload(); // neu laden nach Add
  };

  const update = async (id, data) => {
    await fetch(`${API}/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await reload(); // neu laden nach Update
  };

  const remove = async (id) => {
    await fetch(`${API}/todos/${id}`, { method: "DELETE" });
    return await reload(); // neu laden nach Delete
  };

  return { todos, loading, add, update, remove, reload };
}
