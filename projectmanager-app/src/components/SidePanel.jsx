import { useContext } from "react";
import { PanelCtx } from "../App.jsx";


export default function SidePanel() {
  const { panel, setPanel } = useContext(PanelCtx);
  if (!panel) return null;                 // unsichtbar wenn nichts gewählt

  const Content =
    panel.type === "folder"  ? <FolderMeta  data={panel.data} /> :
    panel.type === "project" ? <ProjectMeta data={panel.data} /> :
                               <TodoMeta    data={panel.data} />;

  return (
    <aside className="side-panel">
      <button className="icon-btn close" onClick={() => setPanel(null)}>✕</button>
      {Content}
    </aside>
  );
}
