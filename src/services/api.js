const API_BASE = import.meta.env.VITE_API_URL || '/api';

const getToken = () => localStorage.getItem('token');

const headers = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

const api = {
  // Auth
  login: (email, password, role) =>
    fetch(`${API_BASE}/auth/login`, { method: 'POST', headers: headers(), body: JSON.stringify({ email, password, role }) }).then(handleResponse),

  getMe: () =>
    fetch(`${API_BASE}/auth/me`, { headers: headers() }).then(handleResponse),

  // Attendance
  submitAttendance: (data) =>
    fetch(`${API_BASE}/attendance`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(handleResponse),

  getAttendance: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/attendance?${query}`, { headers: headers() }).then(handleResponse);
  },

  getStudentStats: (studentId = 'me') =>
    fetch(`${API_BASE}/attendance/stats/${studentId}`, { headers: headers() }).then(handleResponse),

  getAttendanceReport: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/attendance/report?${query}`, { headers: headers() }).then(handleResponse);
  },

  // Admin
  getUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/users?${query}`, { headers: headers() }).then(handleResponse);
  },

  getDepartments: () =>
    fetch(`${API_BASE}/departments`, { headers: headers() }).then(handleResponse),

  getSubjects: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/subjects?${query}`, { headers: headers() }).then(handleResponse);
  },

  getAdminDashboard: () =>
    fetch(`${API_BASE}/dashboard/admin`, { headers: headers() }).then(handleResponse),

  // Create user (admin only)
  createUser: (data) =>
    fetch(`${API_BASE}/users`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(handleResponse),

  deleteUser: (id) =>
    fetch(`${API_BASE}/users/${id}`, { method: 'DELETE', headers: headers() }).then(handleResponse),

  // Classes
  getClasses: () =>
    fetch(`${API_BASE}/classes`, { headers: headers() }).then(handleResponse),

  createClass: (data) =>
    fetch(`${API_BASE}/classes`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(handleResponse),

  updateClass: (id, data) =>
    fetch(`${API_BASE}/classes/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) }).then(handleResponse),

  deleteClass: (id) =>
    fetch(`${API_BASE}/classes/${id}`, { method: 'DELETE', headers: headers() }).then(handleResponse),

  // Create department/subject
  createDepartment: (data) =>
    fetch(`${API_BASE}/departments`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(handleResponse),

  createSubject: (data) =>
    fetch(`${API_BASE}/subjects`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(handleResponse),

  // Health check
  health: () =>
    fetch(`${API_BASE}/health`).then(handleResponse).then(() => true).catch(() => false),
};

export default api;
