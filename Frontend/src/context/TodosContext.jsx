// src/context/TodosContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const API = import.meta.env.VITE_API || "http://localhost:4000/api";

// Context erstellen
const TodosContext = createContext();

// Provider-Komponente
export function TodosProvider({ children }) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Todos vom Backend laden
  const reload = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/todos`);
      const data = await res.json();
      setTodos(data);
      return data;
    } catch (err) {
      console.error("Failed to load todos", err);
    } finally {
      setLoading(false);
    }
  };

  // Hinzufügen
  const add = async (todo) => {
    await fetch(`${API}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todo),
    });
    await reload();
  };

  // Aktualisieren
  const update = async (id, data) => {
    await fetch(`${API}/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    await reload();
  };

  // Löschen
  const remove = async (id) => {
    await fetch(`${API}/todos/${id}`, { method: "DELETE" });
    await reload();
  };

  // Initialdaten laden
  useEffect(() => {
    reload();
  }, []);

  return (
    <TodosContext.Provider value={{ todos, loading, add, update, remove, reload }}>
      {children}
    </TodosContext.Provider>
  );
}

// Custom Hook für bequemen Zugriff
export function useTodosContext() {
  return useContext(TodosContext);
}
