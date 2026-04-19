import { useState, useEffect } from 'react';
import Header from '../../components/Layout/Header';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { todaysClasses as mockClasses, students as mockStudents, getStatusBadge } from '../../data/mockData';
import '../Dashboard.css';

export default function TeacherDashboard() {
  const { backendAvailable } = useAuth();
  const [classes] = useState(mockClasses);

  const completed = classes.filter(c => c.status === 'completed').length;
  const total = classes.length;

  return (
    <>
      <Header title="Teacher Dashboard" breadcrumb="Teacher › Dashboard" />
      <div className="page-content fade-in">
        <h1 className="page-title">📋 Today's Schedule</h1>

        <div className="grid grid-3 kpi-grid">
          <div className="card kpi-card"><div className="kpi-value">{total}</div><div className="kpi-label">Classes Today</div></div>
          <div className="card kpi-card"><div className="kpi-value" style={{color:'var(--success)'}}>{completed}</div><div className="kpi-label">Completed</div></div>
          <div className="card kpi-card"><div className="kpi-value" style={{color:'var(--warning)'}}>{total - completed}</div><div className="kpi-label">Remaining</div></div>
        </div>

        <div className="card">
          <h3 className="card-title">📅 Class Timeline</h3>
          <div className="timeline">
            {classes.map((c, i) => (
              <div className={`timeline-item ${c.status}`} key={i}>
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div>
                      <strong>{c.subject}</strong>
                      <div className="text-sm text-muted">{c.time} · {c.room} · {c.section}</div>
                    </div>
                    <span className={`badge ${c.status === 'completed' ? 'badge-success' : c.status === 'ongoing' ? 'badge-warning' : 'badge-secondary'}`}>
                      {c.status === 'completed' ? '✅ Done' : c.status === 'ongoing' ? '🟡 Ongoing' : '⏳ Upcoming'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
