import { useState, useEffect,useCallback } from 'react';
import ReadingModal from '../components/readingModal';
import ConfirmModal from '../components/confirmModal';
import { Calendar, Plus, Edit2, Trash2, Clock } from 'lucide-react';
import { readingApi } from '../api/readingApi';

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

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(getLocalDateStr());
  const [readings, setReadings] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReading, setEditingReading] = useState(null);
  const [errorBanner, setErrorBanner] = useState('');


  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [readingToDelete, setReadingToDelete] = useState(null);

   const [updateConfirmOpen, setUpdateConfirmOpen] = useState(false);
  const [pendingUpdateData, setPendingUpdateData] = useState(null);

   const fetchReadings = useCallback(async () => {
    try {
      setErrorBanner('');
      const data = await readingApi.getDailyReadings(selectedDate);
      setReadings(data.readings || []);
    } catch (err) {
      setErrorBanner(err.response?.data?.error || 'Failed to load readings.');
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchReadings();
  }, [fetchReadings]);
  
  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

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
    
      setPendingUpdateData(data);
      setUpdateConfirmOpen(true);
    } else {
      await await readingApi.createReading(data);
      fetchReadings();
      setModalOpen(false);
    }
  };

  const handleRequestDelete = (reading) => {
    setReadingToDelete(reading);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!readingToDelete) return;
    try {
      await await readingApi.deleteReading(readingToDelete.id);
      setDeleteConfirmOpen(false);
      setReadingToDelete(null);
      fetchReadings();
    } catch (err) {
      setErrorBanner(err.response?.data?.error || 'Failed to delete reading.');
      setDeleteConfirmOpen(false);
    }
  };

  const handleConfirmUpdate = async () => {
    if (!pendingUpdateData) return;
    try {
      await readingApi.updateReading(pendingUpdateData.id, pendingUpdateData);
      setUpdateConfirmOpen(false);
      setPendingUpdateData(null);
      setModalOpen(false);
      fetchReadings();
    } catch (err) {
      setErrorBanner(err.response?.data?.error || 'Failed to update reading.');
      setUpdateConfirmOpen(false);
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
              max={getLocalDateStr()}
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
            <span className="badge-done">All 4 slots completed for this date</span>
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
                      title="Edit Reading"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleRequestDelete(reading)}
                      className="btn-icon btn-icon-danger"
                      title="Delete Reading"
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

      <ConfirmModal
        isOpen={deleteConfirmOpen}
        title="Delete Reading"
        message={`Are you sure you want to delete the ${readingToDelete?.slot} reading (${readingToDelete?.value} mg/dl) on ${readingToDelete?.date}?`}
        confirmText="Delete"
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setReadingToDelete(null);
        }}
      />
      <ConfirmModal
        isOpen={updateConfirmOpen}
        title="Confirm Update"
        message={`Are you sure you want to update the ${pendingUpdateData?.slot} reading to ${pendingUpdateData?.value} mg/dl for ${pendingUpdateData?.date}?`}
        confirmText="Confirm Update"
        isDanger={false}
        onConfirm={handleConfirmUpdate}
        onCancel={() => {
          setUpdateConfirmOpen(false);
          setPendingUpdateData(null);
        }}
      />
    </div>
  );
}