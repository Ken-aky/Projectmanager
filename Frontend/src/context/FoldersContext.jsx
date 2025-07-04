// src/context/FoldersContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const API = import.meta.env.VITE_API || "http://localhost:4000/api";
const FoldersContext = createContext();

export function FoldersProvider({ children }) {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/folders`);
      const data = await res.json();
      setFolders(data);
      return data;
    } catch (err) {
      console.error("Failed to load folders", err);
    } finally {
      setLoading(false);
    }
  };

  const add = async (data) => {
    await fetch(`${API}/folders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    await reload();
  };

  const update = async (id, data) => {
    await fetch(`${API}/folders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    await reload();
  };

  const remove = async (id) => {
    await fetch(`${API}/folders/${id}`, { method: "DELETE" });
    await reload();
  };

  useEffect(() => {
    reload();
  }, []);

  return (
    <FoldersContext.Provider value={{ folders, loading, add, update, remove, reload }}>
      {children}
    </FoldersContext.Provider>
  );
}

export function useFoldersContext() {
  return useContext(FoldersContext);
}
