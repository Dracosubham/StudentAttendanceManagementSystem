import { useState, useEffect } from 'react';
import Header from '../../components/Layout/Header';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { students as mockStudents, teachersList as mockTeachers, departments as mockDepts } from '../../data/mockData';
import '../Dashboard.css';

export default function UserManagement() {
  const { backendAvailable } = useAuth();
  const [tab, setTab] = useState('students');
  const [search, setSearch] = useState('');
  const [studentList, setStudentList] = useState(mockStudents);
  const [teacherList, setTeacherList] = useState(mockTeachers);
  const [deptList, setDeptList] = useState(mockDepts);

  useEffect(() => {
    if (!backendAvailable) return;
    const load = async () => {
      try {
        if (tab === 'students') {
          const users = await api.getUsers({ role: 'student' });
          setStudentList(users.map(u => ({
            ...u, rollNo: u.rollNo || '', department: u.department?.code || '',
            semester: u.semester || '', attendance: '-',
          })));
        } else if (tab === 'teachers') {
          const users = await api.getUsers({ role: 'teacher' });
          setTeacherList(users.map(u => ({
            ...u, empId: u.empId || '', department: u.department?.code || '',
            designation: u.designation || '', subjects: u.subjects || [],
          })));
        } else {
          const depts = await api.getDepartments();
          setDeptList(depts.map(d => ({ ...d, hod: d.hod?.name || 'N/A' })));
        }
      } catch (e) { console.log('Using mock data:', e.message); }
    };
    load();
  }, [backendAvailable, tab]);

  const tabs = [
    { key: 'students', label: 'Students', icon: '🎓' },
    { key: 'teachers', label: 'Teachers', icon: '👩‍🏫' },
    { key: 'departments', label: 'Departments', icon: '🏛️' },
  ];

  const filteredStudents = studentList.filter(s =>
    (s.name || '').toLowerCase().includes(search.toLowerCase()) || (s.rollNo || '').includes(search)
  );

  return (
    <>
      <Header title="User Management" breadcrumb="Admin › User Management" />
      <div className="page-content fade-in">
        <h1 className="page-title" style={{ marginBottom: 20 }}>👥 User & Department Management</h1>

        <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'var(--bg)', padding: 4, borderRadius: 'var(--radius)' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`btn btn-sm ${tab === t.key ? 'btn-primary' : ''}`}
              style={tab !== t.key ? { background: 'transparent', color: 'var(--text-muted)' } : {}}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {tab === 'students' && (
          <div className="card">
            <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              <button className="btn btn-sm btn-primary">+ Add Student</button>
              <button className="btn btn-sm btn-secondary">📤 Bulk Import</button>
              <input type="text" placeholder="Search by name or roll no..." value={search}
                onChange={e => setSearch(e.target.value)} style={{ maxWidth: 280 }} />
            </div>
            <table className="data-table">
              <thead><tr><th>#</th><th>Roll No</th><th>Name</th><th>Email</th><th>Dept</th><th>Sem</th><th>Attendance</th><th>Status</th></tr></thead>
              <tbody>
                {filteredStudents.map((s, i) => (
                  <tr key={s._id || s.id}><td>{i + 1}</td><td>{s.rollNo}</td><td><strong>{s.name}</strong></td>
                    <td className="text-muted">{s.email}</td><td>{s.department}</td><td>{s.semester}</td>
                    <td><strong>{s.attendance}%</strong></td>
                    <td><span className="badge badge-success">Active</span></td></tr>
                ))}
              </tbody>
            </table>
            <div className="text-sm text-muted" style={{ marginTop: 12 }}>Showing {filteredStudents.length} of {studentList.length} students</div>
          </div>
        )}

        {tab === 'teachers' && (
          <div className="card">
            <button className="btn btn-sm btn-primary" style={{ marginBottom: 16 }}>+ Add Teacher</button>
            <table className="data-table">
              <thead><tr><th>#</th><th>Emp ID</th><th>Name</th><th>Email</th><th>Dept</th><th>Designation</th><th>Subjects</th><th>Status</th></tr></thead>
              <tbody>
                {teacherList.map((t, i) => (
                  <tr key={t._id || t.id}><td>{i + 1}</td><td>{t.empId}</td><td><strong>{t.name}</strong></td>
                    <td className="text-muted">{t.email}</td><td>{t.department}</td><td>{t.designation}</td>
                    <td>{Array.isArray(t.subjects) ? t.subjects.join(', ') : ''}</td>
                    <td><span className="badge badge-success">Active</span></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'departments' && (
          <div className="grid grid-3">
            {deptList.map(d => (
              <div className="card" key={d._id || d.id}>
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 4 }}>{d.code}</h3>
                <p className="text-sm text-muted" style={{ marginBottom: 12 }}>{d.name}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.85rem' }}>
                  <div><span className="text-muted">HOD:</span> <strong>{d.hod}</strong></div>
                  <div><span className="text-muted">Students:</span> <strong>{d.students}</strong></div>
                  <div><span className="text-muted">Teachers:</span> <strong>{d.teachers}</strong></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
