import { useState, useEffect } from 'react';
import Header from '../../components/Layout/Header';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import '../Dashboard.css';

export default function ClassManagement() {
  const { backendAvailable } = useAuth();
  const [classes, setClasses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [showModal, setShowModal] = useState(null); // 'class' | 'student' | 'teacher' | null
  const [expandedClass, setExpandedClass] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form states
  const [classForm, setClassForm] = useState({ name: '', department: '', semester: '3rd', section: 'A', classTeacher: '', academicYear: '2024-25' });
  const [studentForm, setStudentForm] = useState({ name: '', email: '', password: 'student123', rollNo: '', department: '', semester: '3rd', section: 'A' });
  const [teacherForm, setTeacherForm] = useState({ name: '', email: '', password: 'teacher123', empId: '', department: '', designation: 'Assistant Professor' });

  useEffect(() => {
    if (!backendAvailable) return;
    loadData();
  }, [backendAvailable]);

  const loadData = async () => {
    try {
      const [cls, depts, teacherList, studentList] = await Promise.all([
        api.getClasses(), api.getDepartments(),
        api.getUsers({ role: 'teacher' }), api.getUsers({ role: 'student' }),
      ]);
      setClasses(cls);
      setDepartments(depts);
      setTeachers(teacherList);
      setAllStudents(studentList);
    } catch (e) { console.log('Load error:', e.message); }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createClass(classForm);
      toast.success('✅ Class created!');
      setShowModal(null);
      setClassForm({ name: '', department: '', semester: '3rd', section: 'A', classTeacher: '', academicYear: '2024-25' });
      loadData();
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createUser({ ...studentForm, role: 'student' });
      toast.success('✅ Student added!');
      setStudentForm({ name: '', email: '', password: 'student123', rollNo: '', department: '', semester: '3rd', section: 'A' });
      loadData();
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  const handleCreateTeacher = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createUser({ ...teacherForm, role: 'teacher' });
      toast.success('✅ Teacher added!');
      setTeacherForm({ name: '', email: '', password: 'teacher123', empId: '', department: '', designation: 'Assistant Professor' });
      loadData();
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  const addStudentToClass = async (classId, studentId) => {
    try {
      const cls = classes.find(c => c._id === classId);
      const studentIds = cls.students.map(s => s._id || s);
      if (studentIds.includes(studentId)) { toast.error('Student already in class'); return; }
      await api.updateClass(classId, { students: [...studentIds, studentId] });
      toast.success('Student added to class!');
      loadData();
    } catch (err) { toast.error(err.message); }
  };

  const removeStudentFromClass = async (classId, studentId) => {
    try {
      const cls = classes.find(c => c._id === classId);
      const studentIds = cls.students.map(s => s._id || s).filter(id => id !== studentId);
      await api.updateClass(classId, { students: studentIds });
      toast.success('Student removed');
      loadData();
    } catch (err) { toast.error(err.message); }
  };

  if (!backendAvailable) {
    return (
      <>
        <Header title="Class Management" breadcrumb="Admin › Class Management" />
        <div className="page-content fade-in">
          <div className="card" style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>🔌</div>
            <h3>Backend Required</h3>
            <p className="text-muted">Start the backend server to use Class Management.</p>
            <code style={{ display: 'block', marginTop: 12, fontSize: '0.85rem' }}>npm run server</code>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Class Management" breadcrumb="Admin › Class Management" />
      <div className="page-content fade-in">
        <h1 className="page-title" style={{ marginBottom: 20 }}>🏫 Class & User Management</h1>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => setShowModal('class')}>🏫 + Create Class</button>
          <button className="btn btn-success" onClick={() => setShowModal('student')}>🎓 + Add Student</button>
          <button className="btn btn-warning" onClick={() => setShowModal('teacher')}>👩‍🏫 + Add Teacher</button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-4 kpi-grid" style={{ marginBottom: 24 }}>
          <div className="card kpi-card"><div className="kpi-value">{classes.length}</div><div className="kpi-label">Total Classes</div></div>
          <div className="card kpi-card"><div className="kpi-value">{allStudents.length}</div><div className="kpi-label">Total Students</div></div>
          <div className="card kpi-card"><div className="kpi-value">{teachers.length}</div><div className="kpi-label">Total Teachers</div></div>
          <div className="card kpi-card"><div className="kpi-value">{departments.length}</div><div className="kpi-label">Departments</div></div>
        </div>

        {/* Classes list */}
        <div className="card">
          <h3 className="card-title">📋 All Classes</h3>
          {classes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>📭</div>
              No classes created yet. Click "+ Create Class" to get started.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {classes.map(cls => (
                <div key={cls._id} className="card" style={{ padding: '16px 20px', border: expandedClass === cls._id ? '2px solid var(--primary)' : undefined }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                    onClick={() => setExpandedClass(expandedClass === cls._id ? null : cls._id)}>
                    <div>
                      <strong style={{ fontSize: '1.05rem' }}>{cls.name}</strong>
                      <div className="text-sm text-muted" style={{ marginTop: 2 }}>
                        {cls.department?.code} · {cls.semester} Sem · Section {cls.section} · {cls.academicYear}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ textAlign: 'right' }}>
                        <div className="text-sm"><strong>{cls.students?.length || 0}</strong> students</div>
                        <div className="text-sm text-muted">CT: {cls.classTeacher?.name || 'Not assigned'}</div>
                      </div>
                      <span style={{ fontSize: '1.2rem' }}>{expandedClass === cls._id ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {expandedClass === cls._id && (
                    <div style={{ marginTop: 16, borderTop: '1px solid var(--border-light)', paddingTop: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <h4 style={{ margin: 0, fontSize: '0.9rem' }}>Students in this class</h4>
                        <select
                          onChange={(e) => { if (e.target.value) { addStudentToClass(cls._id, e.target.value); e.target.value = ''; } }}
                          style={{ maxWidth: 250, fontSize: '0.8rem' }}>
                          <option value="">+ Add student to class...</option>
                          {allStudents
                            .filter(s => !cls.students?.some(cs => (cs._id || cs) === s._id))
                            .map(s => <option key={s._id} value={s._id}>{s.rollNo} — {s.name}</option>)}
                        </select>
                      </div>
                      {cls.students?.length > 0 ? (
                        <table className="data-table">
                          <thead><tr><th>#</th><th>Roll No</th><th>Name</th><th>Email</th><th>Action</th></tr></thead>
                          <tbody>
                            {cls.students.map((s, i) => (
                              <tr key={s._id}><td>{i + 1}</td><td>{s.rollNo}</td><td>{s.name}</td><td className="text-muted">{s.email}</td>
                                <td><button className="btn btn-sm btn-danger" onClick={() => removeStudentFromClass(cls._id, s._id)} style={{ fontSize: '0.7rem' }}>Remove</button></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : <p className="text-muted text-sm">No students added yet.</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal overlay */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(null); }}>
          <div className="card" style={{ width: '100%', maxWidth: 520, maxHeight: '90vh', overflow: 'auto', animation: 'fadeIn 0.2s ease' }}>

            {showModal === 'class' && (
              <form onSubmit={handleCreateClass}>
                <h3 style={{ marginBottom: 20 }}>🏫 Create New Class</h3>
                <div className="form-group"><label>Class Name</label>
                  <input required placeholder="e.g. CSE 3rd Year Section A" value={classForm.name} onChange={e => setClassForm({ ...classForm, name: e.target.value })} /></div>
                <div className="form-group"><label>Department</label>
                  <select required value={classForm.department} onChange={e => setClassForm({ ...classForm, department: e.target.value })}>
                    <option value="">Select department...</option>
                    {departments.map(d => <option key={d._id} value={d._id}>{d.code} — {d.name}</option>)}
                  </select></div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div className="form-group" style={{ flex: 1 }}><label>Semester</label>
                    <select value={classForm.semester} onChange={e => setClassForm({ ...classForm, semester: e.target.value })}>
                      {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'].map(s => <option key={s}>{s}</option>)}
                    </select></div>
                  <div className="form-group" style={{ flex: 1 }}><label>Section</label>
                    <select value={classForm.section} onChange={e => setClassForm({ ...classForm, section: e.target.value })}>
                      {['A', 'B', 'C', 'D'].map(s => <option key={s}>{s}</option>)}
                    </select></div>
                </div>
                <div className="form-group"><label>Class Teacher</label>
                  <select value={classForm.classTeacher} onChange={e => setClassForm({ ...classForm, classTeacher: e.target.value })}>
                    <option value="">Select class teacher...</option>
                    {teachers.map(t => <option key={t._id} value={t._id}>{t.empId} — {t.name}</option>)}
                  </select></div>
                <div className="form-group"><label>Academic Year</label>
                  <input value={classForm.academicYear} onChange={e => setClassForm({ ...classForm, academicYear: e.target.value })} /></div>
                <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                  <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? '⏳ Creating...' : '✅ Create Class'}</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(null)}>Cancel</button>
                </div>
              </form>
            )}

            {showModal === 'student' && (
              <form onSubmit={handleCreateStudent}>
                <h3 style={{ marginBottom: 20 }}>🎓 Add New Student</h3>
                <div className="form-group"><label>Full Name</label>
                  <input required placeholder="e.g. Rahul Sharma" value={studentForm.name} onChange={e => setStudentForm({ ...studentForm, name: e.target.value })} /></div>
                <div className="form-group"><label>Email</label>
                  <input required type="email" placeholder="e.g. rahul@sams.edu" value={studentForm.email} onChange={e => setStudentForm({ ...studentForm, email: e.target.value })} /></div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div className="form-group" style={{ flex: 1 }}><label>Roll Number</label>
                    <input required placeholder="e.g. 30201220045" value={studentForm.rollNo} onChange={e => setStudentForm({ ...studentForm, rollNo: e.target.value })} /></div>
                  <div className="form-group" style={{ flex: 1 }}><label>Password</label>
                    <input required value={studentForm.password} onChange={e => setStudentForm({ ...studentForm, password: e.target.value })} /></div>
                </div>
                <div className="form-group"><label>Department</label>
                  <select required value={studentForm.department} onChange={e => setStudentForm({ ...studentForm, department: e.target.value })}>
                    <option value="">Select department...</option>
                    {departments.map(d => <option key={d._id} value={d._id}>{d.code} — {d.name}</option>)}
                  </select></div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div className="form-group" style={{ flex: 1 }}><label>Semester</label>
                    <select value={studentForm.semester} onChange={e => setStudentForm({ ...studentForm, semester: e.target.value })}>
                      {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'].map(s => <option key={s}>{s}</option>)}
                    </select></div>
                  <div className="form-group" style={{ flex: 1 }}><label>Section</label>
                    <select value={studentForm.section} onChange={e => setStudentForm({ ...studentForm, section: e.target.value })}>
                      {['A', 'B', 'C', 'D'].map(s => <option key={s}>{s}</option>)}
                    </select></div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                  <button type="submit" className="btn btn-success" disabled={loading}>{loading ? '⏳ Adding...' : '✅ Add Student'}</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(null)}>Cancel</button>
                </div>
              </form>
            )}

            {showModal === 'teacher' && (
              <form onSubmit={handleCreateTeacher}>
                <h3 style={{ marginBottom: 20 }}>👩‍🏫 Add New Teacher</h3>
                <div className="form-group"><label>Full Name</label>
                  <input required placeholder="e.g. Dr. Anita Sharma" value={teacherForm.name} onChange={e => setTeacherForm({ ...teacherForm, name: e.target.value })} /></div>
                <div className="form-group"><label>Email</label>
                  <input required type="email" placeholder="e.g. anita@sams.edu" value={teacherForm.email} onChange={e => setTeacherForm({ ...teacherForm, email: e.target.value })} /></div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div className="form-group" style={{ flex: 1 }}><label>Employee ID</label>
                    <input required placeholder="e.g. FAC006" value={teacherForm.empId} onChange={e => setTeacherForm({ ...teacherForm, empId: e.target.value })} /></div>
                  <div className="form-group" style={{ flex: 1 }}><label>Password</label>
                    <input required value={teacherForm.password} onChange={e => setTeacherForm({ ...teacherForm, password: e.target.value })} /></div>
                </div>
                <div className="form-group"><label>Department</label>
                  <select required value={teacherForm.department} onChange={e => setTeacherForm({ ...teacherForm, department: e.target.value })}>
                    <option value="">Select department...</option>
                    {departments.map(d => <option key={d._id} value={d._id}>{d.code} — {d.name}</option>)}
                  </select></div>
                <div className="form-group"><label>Designation</label>
                  <select value={teacherForm.designation} onChange={e => setTeacherForm({ ...teacherForm, designation: e.target.value })}>
                    {['Assistant Professor', 'Associate Professor', 'Professor', 'HOD', 'Lecturer'].map(d => <option key={d}>{d}</option>)}
                  </select></div>
                <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                  <button type="submit" className="btn btn-warning" disabled={loading}>{loading ? '⏳ Adding...' : '✅ Add Teacher'}</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(null)}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
