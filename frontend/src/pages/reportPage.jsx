import { useState, useEffect ,useCallback} from 'react';
import StatCard from '../components/statCard';
import EmptyState from '../components/emptyState';
import { Calendar, TrendingUp, TrendingDown, Activity, Hash, Clock } from 'lucide-react';
import { reportApi } from '../api/reportApi';

export default function ReportsPage() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [reportType, setReportType] = useState('daily');
  const [reportData, setReportData] = useState(null);
  const [page, setPage] = useState(1);

    const fetchReport = useCallback(async () => {
    try {
      let data;
      if (reportType === 'daily') data = await reportApi.getDailyReport(selectedDate, page);
if (reportType === 'mtd') data = await reportApi.getMonthToDateReport(selectedDate, page);
if (reportType === 'monthly') data = await reportApi.getMonthlyReport(selectedDate, page);
      setReportData(data);
    } catch (err) {
      console.error('Failed to fetch report:', err);
    }
  }, [selectedDate, reportType ,page]);

  useEffect(() => {
  setPage(1);
}, [reportType, selectedDate]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const stats = reportData?.stats || { highest: null, lowest: null, average: null, count: 0 };
  const readings = reportData?.readings || [];
  const pagination = reportData?.pagination || { totalPages: 1, currentPage: 1, totalCount: 0 };

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <div>
          <h2>Glucose Reports & Analytics</h2>
          <p className="subtitle">
            {reportData?.dateRange
              ? `Period: ${reportData.dateRange.start} to ${reportData.dateRange.end}`
              : 'View daily, month-to-date, and previous month statistics'}
          </p>
        </div>

        <div className="date-picker-wrapper">
          <Calendar size={18} />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      <div className="tabs-container">
        <button
          className={`tab-btn ${reportType === 'daily' ? 'active' : ''}`}
          onClick={() => setReportType('daily')}
        >
          Daily Report
        </button>
        <button
          className={`tab-btn ${reportType === 'mtd' ? 'active' : ''}`}
          onClick={() => setReportType('mtd')}
        >
          Month-to-Date (MTD)
        </button>
        <button
          className={`tab-btn ${reportType === 'monthly' ? 'active' : ''}`}
          onClick={() => setReportType('monthly')}
        >
          Monthly (Previous Month)
        </button>
      </div>

      {stats.count === 0 ? (
        <EmptyState message="No glucose readings recorded for this report period." />
      ) : (
        <>
          <div className="stats-grid">
            <StatCard
              title="Highest Reading"
              value={stats.highest}
              unit="mg/dl"
              icon={TrendingUp}
              colorClass="stat-high"
            />
            <StatCard
              title="Lowest Reading"
              value={stats.lowest}
              unit="mg/dl"
              icon={TrendingDown}
              colorClass="stat-low"
            />
            <StatCard
              title="Average Reading"
              value={stats.average}
              unit="mg/dl"
              icon={Activity}
              colorClass="stat-avg"
            />
            <StatCard
              title="Total Readings"
              value={stats.count}
              unit="readings"
              icon={Hash}
              colorClass="stat-count"
            />
          </div>

          <div className="report-details-card">
            <h3>Readings Breakdown</h3>
            <div className="table-wrapper">
              <table className="readings-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time Slot</th>
                    <th>Glucose Value</th>
                  </tr>
                </thead>
                <tbody>
                  {readings.map((r) => (
                    <tr key={r.id}>
                      <td>{r.date}</td>
                      <td>
                        <span className="slot-tag">
                          <Clock size={14} />
                          {r.slot}
                        </span>
                      </td>
                      <td className="value-cell">{r.value} mg/dl</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {pagination.totalPages > 1 && (
  <div className="pagination-controls">
    <button
      className="btn-secondary"
      onClick={() => setPage((p) => p - 1)}
      disabled={page === 1}
    >
      ← Prev
    </button>
    <span className="page-info">
      Page {pagination.currentPage} of {pagination.totalPages}
    </span>
    <button
      className="btn-secondary"
      onClick={() => setPage((p) => p + 1)}
      disabled={page === pagination.totalPages}
    >
      Next →
    </button>
  </div>
)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}