import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import Header from '../../components/Layout/Header';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { students as mockStudents, attendanceTrend, getStatusBadge } from '../../data/mockData';
import '../Dashboard.css';

const COLORS = ['#28a745', '#ffc107', '#dc3545'];

export default function AdminReports() {
  const { backendAvailable } = useAuth();
  const [dept, setDept] = useState('CSE');
  const [studentReport, setStudentReport] = useState([]);

  const filtered = backendAvailable ? studentReport : mockStudents.filter(s => s.department === dept);

  useEffect(() => {
    if (!backendAvailable) return;
    const load = async () => {
      try {
        const report = await api.getAttendanceReport({ department: dept });
        setStudentReport(report.map(r => ({ ...r, attendance: r.percentage })));
      } catch (e) { console.log('Using mock data:', e.message); }
    };
    load();
  }, [backendAvailable, dept]);

  const safe = filtered.filter(s => s.attendance >= 75).length;
  const warn = filtered.filter(s => s.attendance >= 65 && s.attendance < 75).length;
  const danger = filtered.filter(s => s.attendance < 65).length;
  const pieData = [
    { name: 'Safe ≥75%', value: safe },
    { name: 'Warning 65-74%', value: warn },
    { name: 'Danger <65%', value: danger },
  ];
  const avg = filtered.length ? Math.round(filtered.reduce((a, s) => a + s.attendance, 0) / filtered.length) : 0;
  const perfect = filtered.filter(s => s.attendance >= 90).length;

  return (
    <>
      <Header title="Reports" breadcrumb="Admin › Attendance Reports" />
      <div className="page-content fade-in">
        <h1 className="page-title" style={{ marginBottom: 20 }}>📋 Attendance Reports & Analytics</h1>

        <div className="card" style={{ marginBottom: 24 }}>
          <div className="filter-bar">
            <div className="filter-group">
              <label>Department</label>
              <select value={dept} onChange={e => setDept(e.target.value)}>
                {['CSE', 'ECE', 'ME', 'EE', 'IT', 'CE', 'MBA'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label>Semester</label>
              <select><option>3rd</option><option>5th</option><option>7th</option></select>
            </div>
            <div className="filter-group">
              <label>Date From</label>
              <input type="date" defaultValue="2024-01-01" />
            </div>
            <div className="filter-group">
              <label>Date To</label>
              <input type="date" defaultValue="2024-01-31" />
            </div>
            <button className="btn btn-primary" style={{ alignSelf: 'flex-end' }}>Generate Report</button>
          </div>
        </div>

        <div className="grid grid-4 kpi-grid">
          <div className="card kpi-card"><div className="kpi-value">{filtered.length}</div><div className="kpi-label">Total Students</div></div>
          <div className="card kpi-card"><div className="kpi-value" style={{ color: 'var(--success)' }}>{avg}%</div><div className="kpi-label">Average Attendance</div></div>
          <div className="card kpi-card"><div className="kpi-value" style={{ color: 'var(--danger)' }}>{danger}</div><div className="kpi-label">Below 75%</div></div>
          <div className="card kpi-card"><div className="kpi-value" style={{ color: 'var(--success)' }}>{perfect}</div><div className="kpi-label">Perfect (≥90%)</div></div>
        </div>

        <div className="grid grid-2">
          <div className="card">
            <h3 className="card-title">📊 Attendance Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h3 className="card-title">📈 Weekly Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="var(--text-muted)" />
                <YAxis domain={[70, 100]} tick={{ fontSize: 11 }} stroke="var(--text-muted)" />
                <Tooltip />
                <Line type="monotone" dataKey="attendance" stroke="#0056b3" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header-row">
            <h3 className="card-title">📝 Student Report — {dept}</h3>
          </div>
          <table className="data-table">
            <thead><tr><th>#</th><th>Roll No</th><th>Name</th><th>Attendance %</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map((s, i) => {
                const b = getStatusBadge(s.attendance);
                return (
                  <tr key={s._id || s.id}><td>{i + 1}</td><td>{s.rollNo}</td><td>{s.name}</td>
                    <td><strong>{s.attendance}%</strong></td>
                    <td><span className={`badge ${b.class}`}>{b.label}</span></td></tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
            <button className="btn btn-sm btn-success">📥 Export Excel</button>
            <button className="btn btn-sm btn-danger">📄 Export PDF</button>
            <button className="btn btn-sm btn-secondary">📧 Email to HOD</button>
            <button className="btn btn-sm btn-secondary">🖨️ Print</button>
          </div>
        </div>
      </div>
    </>
  );
}
