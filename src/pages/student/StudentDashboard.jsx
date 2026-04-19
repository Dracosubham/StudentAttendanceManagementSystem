import { useState, useEffect } from 'react';
import Header from '../../components/Layout/Header';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { subjects as mockSubjects, getAttendanceColor, getStatusBadge } from '../../data/mockData';
import '../Dashboard.css';

export default function StudentDashboard() {
  const { user, backendAvailable } = useAuth();
  const [subjectData, setSubjectData] = useState(mockSubjects);
  const [overall, setOverall] = useState({ held: 120, attended: 96, percentage: 80 });

  useEffect(() => {
    if (!backendAvailable) return;
    const load = async () => {
      try {
        const stats = await api.getStudentStats('me');
        setOverall(stats.overall);
        if (stats.subjects.length > 0) {
          setSubjectData(stats.subjects.map(s => ({
            name: s.name, code: s.code, attendance: s.percentage,
            held: s.held, attended: s.attended,
          })));
        }
      } catch (e) { console.log('Using mock data:', e.message); }
    };
    load();
  }, [backendAvailable]);

  const overallPct = overall.percentage;
  const circumference = 2 * Math.PI * 70;
  const dashOffset = circumference - (overallPct / 100) * circumference;

  const classesNeeded = (target) => {
    const needed = Math.ceil((target * overall.held - 100 * overall.attended) / (100 - target));
    return Math.max(0, needed);
  };

  return (
    <>
      <Header title="Student Dashboard" breadcrumb="Student › Dashboard" />
      <div className="page-content fade-in">
        <h1 className="page-title">📚 My Attendance</h1>

        <div className="grid grid-3">
          <div className="card" style={{ gridColumn: 'span 1', textAlign: 'center', padding: '2rem' }}>
            <svg width="160" height="160" style={{ margin: '0 auto', display: 'block' }}>
              <circle cx="80" cy="80" r="70" fill="none" stroke="var(--border-light)" strokeWidth="10" />
              <circle cx="80" cy="80" r="70" fill="none"
                stroke={getAttendanceColor(overallPct)} strokeWidth="10" strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={dashOffset}
                transform="rotate(-90 80 80)" style={{ transition: 'stroke-dashoffset 1s ease' }} />
              <text x="80" y="75" textAnchor="middle" fontSize="28" fontWeight="700" fill="var(--text)">{overallPct}%</text>
              <text x="80" y="95" textAnchor="middle" fontSize="11" fill="var(--text-muted)">Overall</text>
            </svg>
            <div style={{ marginTop: 16, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {overall.attended} / {overall.held} classes attended
            </div>
          </div>

          <div className="card" style={{ gridColumn: 'span 2' }}>
            <h3 className="card-title">📊 Subject-wise Breakdown</h3>
            <div className="grid grid-2" style={{ gap: 12 }}>
              {subjectData.map(s => {
                const b = getStatusBadge(s.attendance);
                return (
                  <div key={s.code} className="card" style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.name}</div>
                        <div className="text-sm text-muted">{s.code}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: getAttendanceColor(s.attendance) }}>{s.attendance}%</div>
                        <span className={`badge ${b.class}`} style={{ fontSize: '0.65rem' }}>{b.label}</span>
                      </div>
                    </div>
                    <div style={{ marginTop: 8, background: 'var(--border-light)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                      <div style={{ width: `${s.attendance}%`, height: '100%', background: getAttendanceColor(s.attendance), borderRadius: 4, transition: 'width 0.8s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: 20 }}>
          <h3 className="card-title">🎯 Classes Needed to Reach Target</h3>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[75, 80, 85, 90].map(t => (
              <div key={t} style={{ textAlign: 'center', padding: '12px 20px', background: 'var(--bg)', borderRadius: 'var(--radius)', minWidth: 100 }}>
                <div style={{ fontWeight: 700, fontSize: '1.3rem', color: 'var(--primary)' }}>{classesNeeded(t)}</div>
                <div className="text-sm text-muted">for {t}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
