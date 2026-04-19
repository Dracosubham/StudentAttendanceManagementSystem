import { createContext, useContext, useState, useEffect } from 'react';
import { users } from '../data/mockData';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendAvailable, setBackendAvailable] = useState(false);

  // Check if backend is available and restore session on mount
  useEffect(() => {
    const init = async () => {
      const isUp = await api.health();
      setBackendAvailable(isUp);

      const token = localStorage.getItem('token');
      if (token && isUp) {
        try {
          const userData = await api.getMe();
          setUser({ ...userData, _id: userData._id, avatar: getAvatar(userData.role) });
        } catch {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const getAvatar = (role) => {
    if (role === 'admin') return '👨‍💼';
    if (role === 'teacher') return '👩‍🏫';
    return '🎓';
  };

  const login = async (role, email, password) => {
    // Try real API first if backend is available
    if (backendAvailable && email && password) {
      try {
        const data = await api.login(email, password, role);
        localStorage.setItem('token', data.token);
        setUser({ ...data.user, avatar: getAvatar(role) });
        return true;
      } catch (err) {
        // If real login fails with actual credentials, throw
        if (email && password) throw err;
      }
    }

    // Fallback to mock data (demo mode)
    const userData = users[role];
    if (userData) {
      setUser(userData);
      localStorage.removeItem('token'); // No real token in demo mode
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: 12 }}>🎓</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, backendAvailable }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
