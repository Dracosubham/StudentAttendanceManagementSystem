import { useState } from 'react';
import Header from '../../components/Layout/Header';
import { notifications as notifData } from '../../data/mockData';
import '../Dashboard.css';

export default function NotificationsPage({ role = 'student' }) {
  const [notifs, setNotifs] = useState(notifData);
  const [filter, setFilter] = useState('all');
  const breadcrumb = `${role.charAt(0).toUpperCase() + role.slice(1)} › Notifications`;

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })));

  const filtered = filter === 'all' ? notifs : notifs.filter(n => n.type === filter);
  const tabs = ['all', 'danger', 'warning', 'success', 'info'];
  const tabLabels = { all: 'All', danger: 'Alerts', warning: 'Warnings', success: 'Updates', info: 'System' };

  return (
    <>
      <Header title="Notifications" breadcrumb={breadcrumb} />
      <div className="page-content fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {tabs.map(t => (
              <button key={t} onClick={() => setFilter(t)}
                className={`btn btn-sm ${filter === t ? 'btn-primary' : 'btn-secondary'}`}>
                {tabLabels[t]}
              </button>
            ))}
          </div>
          <button className="btn btn-sm btn-secondary" onClick={markAllRead}>Mark all as read</button>
        </div>

        <div className="notif-list">
          {filtered.map(n => (
            <div className={`notif-item ${!n.read ? 'unread' : ''}`} key={n.id}>
              <div className={`notif-icon ${n.type}`}>
                {n.type === 'danger' ? '🚨' : n.type === 'warning' ? '⚠️' : n.type === 'success' ? '✅' : 'ℹ️'}
              </div>
              <div className="notif-content">
                <div className="notif-title">{n.title}</div>
                <div className="notif-desc">{n.desc}</div>
                <div className="notif-time">{n.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
