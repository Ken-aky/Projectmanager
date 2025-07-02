import { Link } from "react-router-dom";
import { useContext } from "react";
import { useProjectsContext } from "../context/ProjectsContext.jsx"; // ⬅️ neuer Context
import Card from "../components/Card.jsx";
import projectIcon from "../assets/project.png";
import { PanelCtx } from "../App.jsx";

export default function AllProjectsPage() {
  const { projects } = useProjectsContext();      // ⬅️ globaler State
  const { setPanel } = useContext(PanelCtx);

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
                  e.preventDefault();
                  setPanel({ type: "project", data: p });
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
