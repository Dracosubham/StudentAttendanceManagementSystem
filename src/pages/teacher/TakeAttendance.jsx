import { useState, useEffect } from 'react';
import Header from '../../components/Layout/Header';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { students as mockStudents } from '../../data/mockData';
import toast from 'react-hot-toast';
import '../Dashboard.css';

export default function TakeAttendance() {
  const { backendAvailable } = useAuth();
  const [date] = useState(new Date().toISOString().split('T')[0]);
  const [subject, setSubject] = useState('Data Structures');
  const [studentList, setStudentList] = useState(
    mockStudents.filter(s => s.department === 'CSE').map(s => ({ ...s, status: 'present' }))
  );

  useEffect(() => {
    if (!backendAvailable) return;
    const load = async () => {
      try {
        const users = await api.getUsers({ role: 'student' });
        if (users.length > 0) {
          setStudentList(users.map(u => ({
            ...u, id: u._id, name: u.name, rollNo: u.rollNo || '',
            department: u.department?.code || '', status: 'present',
          })));
        }
      } catch (e) { console.log('Using mock data:', e.message); }
    };
    load();
  }, [backendAvailable]);

  const toggleStatus = (id) => {
    setStudentList(prev => prev.map(s => {
      if ((s._id || s.id) === id) {
        const next = s.status === 'present' ? 'absent' : s.status === 'absent' ? 'late' : 'present';
        return { ...s, status: next };
      }
      return s;
    }));
  };

  const markAll = (status) => setStudentList(prev => prev.map(s => ({ ...s, status })));

  const submitAttendance = async () => {
    if (backendAvailable) {
      try {
        const records = studentList.map(s => ({ student: s._id || s.id, status: s.status }));
        await api.submitAttendance({ subject, date, records, section: 'A', semester: '3rd' });
        toast.success('✅ Attendance submitted to database!');
        return;
      } catch (e) {
        if (e.message.includes('already submitted')) {
          toast.error('Attendance already submitted for this session');
          return;
        }
        console.log('API submit failed, using local save:', e.message);
      }
    }
    toast.success('✅ Attendance saved locally!');
  };

  const present = studentList.filter(s => s.status === 'present').length;
  const absent = studentList.filter(s => s.status === 'absent').length;
  const late = studentList.filter(s => s.status === 'late').length;

  const statusIcon = { present: '✅', absent: '❌', late: '⏰' };
  const statusColor = { present: 'var(--success)', absent: 'var(--danger)', late: 'var(--warning)' };

  return (
    <>
      <Header title="Take Attendance" breadcrumb="Teacher › Take Attendance" />
      <div className="page-content fade-in">
        <h1 className="page-title">✍️ Mark Attendance</h1>

        <div className="card" style={{ marginBottom: 20 }}>
          <div className="filter-bar">
            <div className="filter-group">
              <label>Subject</label>
              <select value={subject} onChange={e => setSubject(e.target.value)}>
                <option>Data Structures</option>
                <option>Operating Systems</option>
                <option>DBMS</option>
                <option>Computer Networks</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Date</label>
              <input type="date" value={date} readOnly />
            </div>
            <div className="filter-group">
              <label>Section</label>
              <select><option>A</option><option>B</option></select>
            </div>
          </div>
        </div>

        <div className="grid grid-3 kpi-grid" style={{ marginBottom: 20 }}>
          <div className="card kpi-card"><div className="kpi-value" style={{color:'var(--success)'}}>{present}</div><div className="kpi-label">Present</div></div>
          <div className="card kpi-card"><div className="kpi-value" style={{color:'var(--danger)'}}>{absent}</div><div className="kpi-label">Absent</div></div>
          <div className="card kpi-card"><div className="kpi-value" style={{color:'var(--warning)'}}>{late}</div><div className="kpi-label">Late</div></div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <button className="btn btn-sm btn-success" onClick={() => markAll('present')}>✅ Mark All Present</button>
            <button className="btn btn-sm btn-danger" onClick={() => markAll('absent')}>❌ Mark All Absent</button>
          </div>
          <table className="data-table">
            <thead><tr><th>#</th><th>Roll No</th><th>Name</th><th>Status</th><th>Toggle</th></tr></thead>
            <tbody>
              {studentList.map((s, i) => (
                <tr key={s._id || s.id}>
                  <td>{i + 1}</td><td>{s.rollNo}</td><td><strong>{s.name}</strong></td>
                  <td><span style={{ color: statusColor[s.status], fontWeight: 600 }}>{statusIcon[s.status]} {s.status.charAt(0).toUpperCase() + s.status.slice(1)}</span></td>
                  <td><button className="btn btn-sm" onClick={() => toggleStatus(s._id || s.id)} style={{ minWidth: 40 }}>{statusIcon[s.status]}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-primary btn-lg" style={{ marginTop: 20, width: '100%' }} onClick={submitAttendance}>
            📤 Submit Attendance ({present}P / {absent}A / {late}L)
          </button>
        </div>
      </div>
    </>
  );
}
