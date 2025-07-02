
import Card from "./Card.jsx";

export default function TodoCard({
  title,
  done = false,        //  NEU
  onToggle,            //  NEU
  onDelete,
  onEdit,
  onInfo,
  infoIcon,
}) {
   return (
    <Card onInfo={onInfo} onClick={onToggle} infoIcon={infoIcon}>
      <span className={done ? "todo-done" : ""}>{title}</span>
       <div className="todo-buttons">
         <button onClick={onDelete}>Delete</button>
         <button onClick={onEdit}>Change</button>
       </div>
     </Card>
   );
 }
