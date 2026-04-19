import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Header from '../../components/Layout/Header';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { departments as mockDepts, students as mockStudents, attendanceTrend as mockTrend, departmentAttendance as mockDeptAtt, recentActivity as mockActivity, getStatusBadge } from '../../data/mockData';
import '../Dashboard.css';

export default function AdminDashboard() {
  const { backendAvailable } = useAuth();
  const [stats, setStats] = useState({ totalStudents: mockStudents.length, totalTeachers: 5, totalDepartments: mockDepts.length });
  const [lowAttendance, setLowAttendance] = useState(mockStudents.filter(s => s.attendance < 75));
  const [trend, setTrend] = useState(mockTrend);
  const [deptAtt, setDeptAtt] = useState(mockDeptAtt);
  const [activity] = useState(mockActivity);

  useEffect(() => {
    if (!backendAvailable) return;
    const load = async () => {
      try {
        const dashData = await api.getAdminDashboard();
        setStats(dashData);
        const report = await api.getAttendanceReport({});
        const low = report.filter(s => s.percentage < 75);
        setLowAttendance(low.map(s => ({ ...s, attendance: s.percentage })));
      } catch (e) { console.log('Using mock data:', e.message); }
    };
    load();
  }, [backendAvailable]);

  return (
    <>
      <Header title="Admin Dashboard" breadcrumb="Admin › Dashboard" />
      <div className="page-content fade-in">
        <h1 className="page-title">📊 Dashboard Overview</h1>

        <div className="grid grid-4 kpi-grid">
          <div className="card kpi-card"><div className="kpi-value">{stats.totalStudents}</div><div className="kpi-label">Total Students</div></div>
          <div className="card kpi-card"><div className="kpi-value">{stats.totalTeachers}</div><div className="kpi-label">Total Teachers</div></div>
          <div className="card kpi-card"><div className="kpi-value">{stats.totalDepartments}</div><div className="kpi-label">Departments</div></div>
          <div className="card kpi-card"><div className="kpi-value" style={{color:'var(--success)'}}>82%</div><div className="kpi-label">Avg Attendance</div></div>
        </div>

        <div className="grid grid-2">
          <div className="card">
            <h3 className="card-title">📈 Weekly Attendance Trend</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="var(--text-muted)" />
                <YAxis domain={[70, 100]} tick={{ fontSize: 11 }} stroke="var(--text-muted)" />
                <Tooltip />
                <Line type="monotone" dataKey="attendance" stroke="#0056b3" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h3 className="card-title">🏛️ Department-wise Attendance</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={deptAtt}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="dept" tick={{ fontSize: 11 }} stroke="var(--text-muted)" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="var(--text-muted)" />
                <Tooltip />
                <Bar dataKey="attendance" fill="#0056b3" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-2">
          <div className="card">
            <h3 className="card-title">⚠️ Low Attendance Alerts ({lowAttendance.length})</h3>
            <table className="data-table">
              <thead><tr><th>Student</th><th>Roll No</th><th>Attendance</th><th>Status</th></tr></thead>
              <tbody>
                {lowAttendance.slice(0, 8).map(s => {
                  const b = getStatusBadge(s.attendance);
                  return (
                    <tr key={s.id || s.rollNo}>
                      <td><strong>{s.name}</strong></td><td>{s.rollNo}</td>
                      <td><strong>{s.attendance}%</strong></td>
                      <td><span className={`badge ${b.class}`}>{b.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="card">
            <h3 className="card-title">🕐 Recent Activity</h3>
            <div className="activity-list">
              {activity.map((a, i) => (
                <div className="activity-item" key={i}>
                  <span className="activity-icon">{a.icon}</span>
                  <div>
                    <div className="activity-text">{a.text}</div>
                    <div className="activity-time">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
