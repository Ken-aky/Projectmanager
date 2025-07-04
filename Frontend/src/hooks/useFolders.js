import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API || "http://localhost:4000/api";

export function useFolders() {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  // API-Reload immer frisch aus dem Backend
  const reload = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/folders`);
      const data = await res.json();
      setFolders(data);
      return data; // wichtig für Updates!
    } catch (err) {
      console.error("Failed to load folders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, []);

  // Neuen Ordner hinzufügen und direkt danach reloaden
  const add = async (data) => {
    const res = await fetch(`${API}/folders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    await res.json();
    return await reload(); // fetch + set
  };

  // Ordner aktualisieren und neu laden
  const update = async (id, data) => {
    await fetch(`${API}/folders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await reload();
  };

  // Ordner löschen und neu laden
  const remove = async (id) => {
    await fetch(`${API}/folders/${id}`, { method: "DELETE" });
    return await reload();
  };

  return { folders, loading, add, update, remove, reload };
}
