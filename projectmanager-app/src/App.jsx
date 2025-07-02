import { Routes, Route } from "react-router-dom";
import { createContext, useState } from "react";
import NavBar from "./components/NavBar.jsx";
import TodayPage from "./pages/TodayPage.jsx";
import FolderPage from "./pages/FolderPage.jsx";
import ProjectPage from "./pages/ProjectPage.jsx";
import TodoPage from "./pages/TodoPage.jsx";
import AllProjectsPage from "./pages/AllProjectsPage.jsx";
import AllTodosPage from "./pages/AllTodosPage.jsx";
import SidePanel from "./components/SidePanel.jsx";

// Globaler Context für das Info-Panel
export const PanelCtx = createContext();

export default function App() {
  const [panel, setPanel] = useState(null);

  return (
    <PanelCtx.Provider value={{ panel, setPanel }}>
      <NavBar />
      <main className="container">
        <Routes>
          <Route path="/" element={<TodayPage />} />
          <Route path="/folders" element={<FolderPage />} />
          <Route path="/projects" element={<AllProjectsPage />} />
          <Route path="/projects/:folderId" element={<ProjectPage />} />
          <Route path="/todos" element={<AllTodosPage />} />
          <Route path="/todos/:projectId" element={<TodoPage />} />
        </Routes>
      </main>
      <SidePanel />
    </PanelCtx.Provider>
  );
}
