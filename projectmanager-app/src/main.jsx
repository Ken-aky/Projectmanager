import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./css/main.css";
import { TodosProvider } from "./context/TodosContext.jsx";
import { ProjectsProvider } from "./context/ProjectsContext.jsx";
import { FoldersProvider } from "./context/FoldersContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <FoldersProvider>
        <ProjectsProvider>
          <TodosProvider>
            <App />
          </TodosProvider>
        </ProjectsProvider>
      </FoldersProvider>
    </BrowserRouter>
  </React.StrictMode>
);