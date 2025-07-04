export default function Card({ className = "", children, onClick, onInfo, infoIcon }) {
  return (
    <div
      className={`card ${className}`}
      onClick={onClick}
    >
      {onInfo && (
        <img
          className="info-icon"
          src={infoIcon}
          alt="info"
          onClick={(e) => {
            e.stopPropagation();
            onInfo();
          }}
        />
      )}
      {children}
    </div>
  );
}
