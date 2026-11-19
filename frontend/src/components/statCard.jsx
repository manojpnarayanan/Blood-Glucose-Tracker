
export default function StatCard({ title, value, unit, icon: Icon, colorClass }) {
  return (
    <div className={`stat-card ${colorClass}`}>
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        {Icon && <Icon size={20} className="stat-icon" />}
      </div>
      <div className="stat-body">
        <span className="stat-value">{value !== null && value !== undefined ? value : '—'}</span>
        {unit && value !== null && <span className="stat-unit">{unit}</span>}
      </div>
    </div>
  );
}