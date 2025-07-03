import Card from "./Card.jsx";

export default function TodoCard({
  title,
  done = false,
  onToggle,
  onInfo,
  infoIcon,
}) {
  return (
    <Card onInfo={onInfo} infoIcon={infoIcon} className={done ? "done" : ""}>
      <div className="todo-content">
        <input
          type="checkbox"
          checked={done}
          onChange={onToggle}
        />
        <span className={done ? "todo-done" : ""}>{title}</span>
      </div>
    </Card>
  );
}
