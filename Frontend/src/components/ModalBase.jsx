import { createPortal } from "react-dom";

export default function ModalBase({ title, children }) {
  return createPortal(
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal large">
        <header className="modal-header">
          <h2>{title}</h2>
        </header>
        {children}
      </div>
    </div>,
    document.body
  );
}