import React from 'react';
import { HeartPulse } from 'lucide-react';

export default function EmptyState({ message, actionText, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-icon-wrapper">
        <HeartPulse size={48} className="empty-icon" />
      </div>
      <h3>No readings recorded</h3>
      <p>{message || 'There are no glucose readings for the selected date range.'}</p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn-primary">
          {actionText}
        </button>
      )}
    </div>
  );
}