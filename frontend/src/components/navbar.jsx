import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { HeartPulse, LayoutDashboard, BarChart3, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/dashboard" className="nav-logo">
          <HeartPulse className="logo-icon" size={28} />
          <span>Sweety</span>
        </Link>

        <nav className="nav-links">
          <Link
            to="/dashboard"
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/reports"
            className={`nav-link ${location.pathname === '/reports' ? 'active' : ''}`}
          >
            <BarChart3 size={18} />
            <span>Reports</span>
          </Link>
        </nav>

        <div className="nav-user">
          <span className="user-name">Hello, {user.name}</span>
          <button onClick={handleLogout} className="btn-logout" title="Log out">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}