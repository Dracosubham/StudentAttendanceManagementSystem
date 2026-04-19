import Header from '../../components/Layout/Header';
import { timetable } from '../../data/mockData';
import '../Dashboard.css';

const colors = ['#e8f0fe', '#d4edda', '#f3e5f5', '#fff3cd', '#d1ecf1', '#fce4ec'];

export default function TimetableView({ role = 'student' }) {
  const breadcrumb = role === 'admin' ? 'Admin › Timetable' : role === 'teacher' ? 'Teacher › Timetable' : 'Student › Timetable';

  return (
    <>
      <Header title="Timetable" breadcrumb={breadcrumb} />
      <div className="page-content fade-in">
        <div className="card" style={{ marginBottom: 16, padding: 16 }}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <strong>CSE-A · 3rd Semester · 2024</strong>
            {role !== 'student' && (
              <>
                <button className="btn btn-sm btn-secondary">📤 Upload Excel</button>
                <button className="btn btn-sm btn-primary">💾 Save Changes</button>
              </>
            )}
          </div>
        </div>

        <div className="card" style={{ overflow: 'auto' }}>
          <table className="timetable-grid">
            <thead>
              <tr>
                <th style={{ width: 90 }}>Time</th>
                {timetable.days.map(d => <th key={d}>{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {timetable.slots.map((slot, si) => (
                <tr key={slot}>
                  <td style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--primary)' }}>{slot}</td>
                  {timetable.days.map((day, di) => {
                    const cell = timetable.data[day]?.[si] || '';
                    if (cell === 'LUNCH') return <td key={di} className="tt-lunch">🍽️ Lunch Break</td>;
                    if (!cell) return <td key={di} className="tt-empty">—</td>;
                    const [subj, teacher, room] = cell.split('|');
                    const bg = colors[(subj.charCodeAt(0) + subj.length) % colors.length];
                    return (
                      <td key={di}>
                        <div className="tt-cell" style={{ background: bg }}>
                          <div className="tt-subject">{subj}</div>
                          <div className="tt-teacher">{teacher}</div>
                          <div className="tt-room">📍 {room}</div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
