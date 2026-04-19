import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const navItems = {
  admin: [
    { path: '/admin', icon: '📊', label: 'Dashboard', end: true },
    { path: '/admin/departments', icon: '🏛️', label: 'Departments' },
    { path: '/admin/timetable', icon: '📅', label: 'Timetable' },
    { path: '/admin/users', icon: '👥', label: 'User Management' },
    { path: '/admin/classes', icon: '🏫', label: 'Class Management' },
    { path: '/admin/reports', icon: '📋', label: 'Attendance Reports' },
    { path: '/admin/notifications', icon: '🔔', label: 'Notifications' },
  ],
  teacher: [
    { path: '/teacher', icon: '📊', label: 'Dashboard', end: true },
    { path: '/teacher/attendance', icon: '✅', label: 'Take Attendance' },
    { path: '/teacher/timetable', icon: '📅', label: 'My Timetable' },
    { path: '/teacher/students', icon: '🎓', label: 'Student Records' },
    { path: '/teacher/history', icon: '📜', label: 'Attendance History' },
    { path: '/teacher/reports', icon: '📋', label: 'Reports' },
    { path: '/teacher/notifications', icon: '🔔', label: 'Notifications' },
  ],
  student: [
    { path: '/student', icon: '📊', label: 'Dashboard', end: true },
    { path: '/student/attendance', icon: '📋', label: 'My Attendance' },
    { path: '/student/timetable', icon: '📅', label: 'Timetable' },
    { path: '/student/calendar', icon: '🗓️', label: 'Calendar' },
    { path: '/student/reports', icon: '📥', label: 'Download Reports' },
    { path: '/student/notifications', icon: '🔔', label: 'Notifications' },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  const items = navItems[user.role] || [];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-circle">M</div>
        <div>
          <div className="logo-title">SAMS</div>
          <div className="logo-subtitle">Attendance Management</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {items.map(item => (
          <NavLink key={item.path} to={item.path} end={item.end}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">{user.avatar}</div>
          <div>
            <div className="user-name">{user.name}</div>
            <div className="user-role">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</div>
          </div>
        </div>
        <button className="btn-logout" onClick={logout}>↩ Sign Out</button>
      </div>
    </aside>
  );
}
