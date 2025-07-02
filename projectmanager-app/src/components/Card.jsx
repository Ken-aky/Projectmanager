export default function Card({
  children,
  className = "",
  onInfo,  
  infoIcon,            //  NEU — Info-Handler
  ...props
}) {
  return (
    <div className={`card ${className}`.trim()} {...props}>
      {infoIcon && (
         <img
         src={infoIcon}
         alt="info"
         className="info-icon"
         onClick={(e) => {
           if (onInfo) {          // klickbar nur, wenn Handler übergeben
             e.stopPropagation();
             onInfo();
           }
         }}
       style={{ cursor: onInfo ? "pointer" : "default" }} />
      )}
      {children}
    </div>
  );
}
