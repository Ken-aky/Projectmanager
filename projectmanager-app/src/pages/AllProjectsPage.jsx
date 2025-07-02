import { Link } from "react-router-dom";
import { useContext } from "react";
import { useProjects } from "../hooks/useProjects.js";
import Card from "../components/Card.jsx";
import projectIcon from "../assets/project.png";
import { PanelCtx } from "../App.jsx"; // Kontext importieren

export default function AllProjectsPage() {
  const { projects } = useProjects();          // Aus API laden
  const { setPanel } = useContext(PanelCtx);  // Info-Panel-Setter

  return (
    <section>
      <h1>All Projects</h1>

      <ul className="grid auto-fill">
        {projects.map((p) => (
          <li key={p.id}>
            <Link to={`/projects/${p.folderId}`}>
              <Card
                className="view-only"
                infoIcon={projectIcon}
                onInfo={(e) => {
                  e.preventDefault();              // Link-Klick verhindern
                  setPanel({ type: "project", data: p }); // Info anzeigen
                }}
              >
                {p.title}
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
