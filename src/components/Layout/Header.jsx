import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './Header.css';

export default function Header({ title, breadcrumb }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  if (!user) return null;

  return (
    <header className="top-header">
      <div className="header-left">
        <div className="breadcrumb">{breadcrumb || title}</div>
      </div>
      <div className="header-right">
        <div className="header-search">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search..." className="search-input" />
        </div>
        <button className="header-icon-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <button className="header-icon-btn notification-btn" title="Notifications">
          🔔<span className="notif-badge">3</span>
        </button>
        <div className="header-user">
          <span className="header-avatar">{user.avatar}</span>
        </div>
      </div>
    </header>
  );
}
