import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, title, message, confirmText = 'Confirm', onConfirm, onCancel, isDanger = false }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card confirm-modal-card">
        <div className="modal-header">
          <div className="confirm-header-title">
            <AlertTriangle className={isDanger ? 'icon-danger' : 'icon-warning'} size={22} />
            <h3>{title}</h3>
          </div>
          <button onClick={onCancel} className="btn-close">
            <X size={20} />
          </button>
        </div>
        <p className="confirm-message">{message}</p>
        <div className="modal-actions">
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={isDanger ? 'btn-danger' : 'btn-primary'}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}