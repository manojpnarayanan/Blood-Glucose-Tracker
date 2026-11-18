import React, { useState, useEffect } from 'react';
import api from '../api/client';
import ReadingModal from '../components/readingModal';
import { Calendar, Plus, Edit2, Trash2, CheckCircle2, Clock } from 'lucide-react';

const SLOTS = [
  'Morning (fasting)',
  'After breakfast',
  'After lunch',
  'After dinner',
];

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReading, setEditingReading] = useState(null);
  const [errorBanner, setErrorBanner] = useState('');

  const fetchReadings = async () => {
    try {
      setLoading(true);
      setErrorBanner('');
      const res = await api.get(`/readings?date=${selectedDate}`);
      setReadings(res.data.readings || []);
    } catch (err) {
      setErrorBanner(err.response?.data?.error || 'Failed to load readings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadings();
  }, [selectedDate]);

  const handleOpenAdd = (defaultSlot = null) => {
    setEditingReading(defaultSlot ? { slot: defaultSlot, date: selectedDate } : null);
    setModalOpen(true);
  };

  const handleOpenEdit = (reading) => {
    setEditingReading(reading);
    setModalOpen(true);
  };

  const handleSave = async (data) => {
    if (data.id) {
      await api.put(`/readings/${data.id}`, data);
    } else {
      await api.post('/readings', data);
    }
    fetchReadings();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reading?')) return;
    try {
      await api.delete(`/readings/${id}`);
      fetchReadings();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete reading.');
    }
  };

  const getGlucoseStatus = (val) => {
    if (val < 70) return { label: 'Low', class: 'badge-low' };
    if (val <= 140) return { label: 'Normal', class: 'badge-normal' };
    if (val <= 199) return { label: 'Elevated', class: 'badge-elevated' };
    return { label: 'High', class: 'badge-high' };
  };

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <div>
          <h2>Daily Glucose Tracker</h2>
          <p className="subtitle">Track up to 4 readings per day</p>
        </div>

        <div className="date-controls">
          <div className="date-picker-wrapper">
            <Calendar size={18} />
            <input
              type="date"
              value={selectedDate}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <button
            onClick={() => handleOpenAdd()}
            disabled={readings.length >= 4}
            className="btn-primary"
          >
            <Plus size={18} />
            <span>Add Reading</span>
          </button>
        </div>
      </div>

      {errorBanner && <div className="alert-error">{errorBanner}</div>}

      <div className="daily-progress-card">
        <div className="progress-info">
          <span>Readings today: <strong>{readings.length} / 4</strong></span>
          {readings.length >= 4 && (
            <span className="badge-done">All slots completed today</span>
          )}
        </div>
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{ width: `${(readings.length / 4) * 100}%` }}
          />
        </div>
      </div>

      <div className="slots-grid">
        {SLOTS.map((slotName) => {
          const reading = readings.find((r) => r.slot === slotName);
          const status = reading ? getGlucoseStatus(reading.value) : null;

          return (
            <div
              key={slotName}
              className={`slot-card ${reading ? 'slot-recorded' : 'slot-empty'}`}
            >
              <div className="slot-header">
                <div className="slot-title-group">
                  <Clock size={16} />
                  <h4>{slotName}</h4>
                </div>
                {reading ? (
                  <span className={`badge ${status.class}`}>{status.label}</span>
                ) : (
                  <span className="badge badge-unrecorded">Pending</span>
                )}
              </div>

              <div className="slot-body">
                {reading ? (
                  <div className="value-display">
                    <span className="reading-value">{reading.value}</span>
                    <span className="reading-unit">mg/dl</span>
                  </div>
                ) : (
                  <div className="empty-slot-text">No reading recorded</div>
                )}
              </div>

              <div className="slot-footer">
                {reading ? (
                  <div className="slot-actions">
                    <button
                      onClick={() => handleOpenEdit(reading)}
                      className="btn-icon"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(reading.id)}
                      className="btn-icon btn-icon-danger"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleOpenAdd(slotName)}
                    className="btn-record"
                    disabled={readings.length >= 4}
                  >
                    <Plus size={16} />
                    <span>Record</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <ReadingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        reading={editingReading}
        currentDate={selectedDate}
      />
    </div>
  );
}