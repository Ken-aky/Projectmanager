import { useState, useEffect } from "react";
const API = import.meta.env.VITE_API || "http://localhost:4000/api";

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/projects`);
      const data = await res.json();
      setProjects(data);
      return data;
    } catch (err) {
      console.error("Failed to load projects", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, []);

  const add = async (data) => {
    await fetch(`${API}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await reload();
  };

  const update = async (id, data) => {
    await fetch(`${API}/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await reload();
  };

  const remove = async (id) => {
    await fetch(`${API}/projects/${id}`, { method: "DELETE" });
    return await reload();
  };

  return { projects, loading, add, update, remove, reload };
}
