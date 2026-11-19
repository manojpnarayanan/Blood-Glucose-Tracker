import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

const SLOTS = [
  'Morning (fasting)',
  'After breakfast',
  'After lunch',
  'After dinner',
];

const getLocalDateStr = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function ReadingModal({ isOpen, onClose, onSave, reading, currentDate }) {
  const [slot, setSlot] = useState(SLOTS[0]);
  const [value, setValue] = useState('');
  const [date, setDate] = useState(currentDate || getLocalDateStr());
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);


  useEffect(() => {
    if (reading) {
      setSlot(reading.slot);
      setValue(reading.value !== undefined ? String(reading.value) : '');
      setDate(reading.date || currentDate || getLocalDateStr());
    } else {
      setSlot(SLOTS[0]);
      setValue('');
      setDate(currentDate || getLocalDateStr());
    }
    setError('');
  }, [reading, currentDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setSaving(true);
      await onSave({
        id: reading ? reading.id : undefined,
        date,
        slot,
        value: value === '' ? '' : Number(value),
      });
      onClose();
    } catch (err) {
      // Display the exact error message returned by your backend API
      const backendError = err.response?.data?.error || err.message || 'Failed to save reading.';
      setError(backendError);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h3>{reading && reading.id ? 'Edit Glucose Reading' : 'Record Glucose Reading'}</h3>
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

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={date}
              max={getLocalDateStr()}
              onChange={(e) => setDate(e.target.value)}
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
              type="text"
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
              {saving ? 'Saving...' : reading && reading.id ? 'Update Reading' : 'Save Reading'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}