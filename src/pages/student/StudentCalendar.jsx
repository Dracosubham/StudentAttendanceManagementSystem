import { useState } from 'react';
import Header from '../../components/Layout/Header';
import { calendarData } from '../../data/mockData';
import '../Dashboard.css';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function StudentCalendar() {
  const [month, setMonth] = useState(0); // January
  const [year] = useState(2024);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];

  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const getStatus = (day) => {
    if (!day) return '';
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return calendarData[key] || '';
  };

  const stats = Object.values(calendarData);
  const presentDays = stats.filter(s => s === 'present').length;
  const absentDays = stats.filter(s => s === 'absent').length;
  const lateDays = stats.filter(s => s === 'late').length;
  const holidays = stats.filter(s => s === 'holiday').length;

  return (
    <>
      <Header title="Calendar" breadcrumb="Student › Calendar" />
      <div className="page-content fade-in">
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <button className="btn btn-sm btn-secondary" onClick={() => setMonth(m => Math.max(0, m - 1))}>← Previous</button>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{MONTHS[month]} {year}</h2>
            <button className="btn btn-sm btn-secondary" onClick={() => setMonth(m => Math.min(11, m + 1))}>Next →</button>
          </div>

          <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
            <span className="badge badge-success">🟢 Present</span>
            <span className="badge badge-danger">🔴 Absent</span>
            <span className="badge badge-warning">🟡 Late</span>
            <span className="badge" style={{ background: 'var(--surface-container)', color: 'var(--text-muted)' }}>⚪ Holiday</span>
          </div>

          <div className="calendar-grid">
            {DAYS.map(d => <div className="cal-header" key={d}>{d}</div>)}
            {cells.map((day, i) => {
              const status = getStatus(day);
              const isToday = day === 15 && month === 0;
              return (
                <div key={i} className={`cal-day ${status} ${!day ? 'empty' : ''} ${isToday ? 'today' : ''}`}>
                  {day || ''}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-4">
          <div className="card kpi-card">
            <div className="kpi-value" style={{ color: 'var(--success)' }}>{presentDays}</div>
            <div className="kpi-label">Days Present</div>
          </div>
          <div className="card kpi-card">
            <div className="kpi-value" style={{ color: 'var(--danger)' }}>{absentDays}</div>
            <div className="kpi-label">Days Absent</div>
          </div>
          <div className="card kpi-card">
            <div className="kpi-value" style={{ color: 'var(--warning-dark)' }}>{lateDays}</div>
            <div className="kpi-label">Days Late</div>
          </div>
          <div className="card kpi-card">
            <div className="kpi-value" style={{ color: 'var(--text-muted)' }}>{holidays}</div>
            <div className="kpi-label">Holidays</div>
          </div>
        </div>
      </div>
    </>
  );
}
