import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Layout/Sidebar';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminReports from './pages/admin/AdminReports';
import UserManagement from './pages/admin/UserManagement';
import ClassManagement from './pages/admin/ClassManagement';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TakeAttendance from './pages/teacher/TakeAttendance';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentCalendar from './pages/student/StudentCalendar';
import TimetableView from './pages/shared/TimetableView';
import NotificationsPage from './pages/shared/NotificationsPage';
import { Toaster } from 'react-hot-toast';
import './index.css';

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to={`/${user.role}`} replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Routes>
          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute role="admin"><AdminReports /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute role="admin"><UserManagement /></ProtectedRoute>} />
          <Route path="/admin/departments" element={<ProtectedRoute role="admin"><UserManagement /></ProtectedRoute>} />
          <Route path="/admin/classes" element={<ProtectedRoute role="admin"><ClassManagement /></ProtectedRoute>} />
          <Route path="/admin/timetable" element={<ProtectedRoute role="admin"><TimetableView role="admin" /></ProtectedRoute>} />
          <Route path="/admin/notifications" element={<ProtectedRoute role="admin"><NotificationsPage role="admin" /></ProtectedRoute>} />

          {/* Teacher */}
          <Route path="/teacher" element={<ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>} />
          <Route path="/teacher/attendance" element={<ProtectedRoute role="teacher"><TakeAttendance /></ProtectedRoute>} />
          <Route path="/teacher/timetable" element={<ProtectedRoute role="teacher"><TimetableView role="teacher" /></ProtectedRoute>} />
          <Route path="/teacher/students" element={<ProtectedRoute role="teacher"><AdminReports /></ProtectedRoute>} />
          <Route path="/teacher/history" element={<ProtectedRoute role="teacher"><AdminReports /></ProtectedRoute>} />
          <Route path="/teacher/reports" element={<ProtectedRoute role="teacher"><AdminReports /></ProtectedRoute>} />
          <Route path="/teacher/notifications" element={<ProtectedRoute role="teacher"><NotificationsPage role="teacher" /></ProtectedRoute>} />

          {/* Student */}
          <Route path="/student" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/attendance" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/calendar" element={<ProtectedRoute role="student"><StudentCalendar /></ProtectedRoute>} />
          <Route path="/student/timetable" element={<ProtectedRoute role="student"><TimetableView role="student" /></ProtectedRoute>} />
          <Route path="/student/reports" element={<ProtectedRoute role="student"><AdminReports /></ProtectedRoute>} />
          <Route path="/student/notifications" element={<ProtectedRoute role="student"><NotificationsPage role="student" /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to={`/${user.role}`} replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'var(--font)', fontSize: '0.875rem' } }} />
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
