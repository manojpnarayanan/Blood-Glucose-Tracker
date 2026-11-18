import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

const SLOTS = [
  'Morning (fasting)',
  'After breakfast',
  'After lunch',
  'After dinner',
];

export default function ReadingModal({ isOpen, onClose, onSave, reading, currentDate }) {
  const [slot, setSlot] = useState(SLOTS[0]);
  const [value, setValue] = useState('');
  const [date, setDate] = useState(currentDate);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (reading) {
      setSlot(reading.slot);
      setValue(reading.value);
      setDate(reading.date);
    } else {
      setSlot(SLOTS[0]);
      setValue('');
      setDate(currentDate);
    }
    setError('');
  }, [reading, currentDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Rule 1: Value is required
    if (value === '' || value === null || value === undefined) {
      setError('Please enter a glucose value.');
      return;
    }

    const numValue = Number(value);
    // Rule 2: Whole number between 40 and 600
    if (!Number.isInteger(numValue) || numValue < 40 || numValue > 600) {
      setError('Value must be between 40 and 600 mg/dl.');
      return;
    }

    // Rule 5: Date cannot be in the future
    const todayStr = new Date().toISOString().split('T')[0];
    if (date > todayStr) {
      setError('Date cannot be in the future.');
      return;
    }

    try {
      setSaving(true);
      await onSave({
        id: reading ? reading.id : undefined,
        date,
        slot,
        value: numValue,
      });
      onClose();
    } catch (err) {
      // Backend error message (e.g. Max 4 per day or Duplicate slot)
      const msg = err.response?.data?.error || err.message || 'Failed to save reading.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h3>{reading ? 'Edit Glucose Reading' : 'Record Glucose Reading'}</h3>
          <button onClick={onClose} className="btn-close">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={date}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Time Slot</label>
            <select value={slot} onChange={(e) => setSlot(e.target.value)}>
              {SLOTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Glucose Value (mg/dl)</label>
            <input
              type="number"
              placeholder="e.g. 110"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoFocus
            />
            <small className="help-text">Whole number between 40 and 600 mg/dl</small>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : reading ? 'Update Reading' : 'Save Reading'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}