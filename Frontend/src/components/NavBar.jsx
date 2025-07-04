import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Today" },
  { to: "/folders", label: "Folders" },
  { to: "/projects", label: "Projects" },
  { to: "/todos", label: "Todos" },
];

export default function NavBar() {
  return (
    <nav className="navbar">
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          className={({ isActive }) => (isActive ? "active" : undefined)}
          end={l.to === "/"}
        >
          {l.label}
        </NavLink>
      ))}
    </nav>
  );
}