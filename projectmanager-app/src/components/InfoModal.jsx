import ModalBase from "./ModalBase.jsx";

export default function InfoModal({ title, data, onClose }) {
  return (
    <ModalBase title={title}>
      <ul className="info-list">
        {Object.entries(data).map(([key, val]) => (
          <li key={key}>
            <strong>{key}:</strong> {val?.toString() || "—"}
          </li>
        ))}
      </ul>

      <div className="modal-buttons">
        <button
          type="button"
          className="secondary"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </ModalBase>
  );
}
