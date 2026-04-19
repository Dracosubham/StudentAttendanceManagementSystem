import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [activeTab, setActiveTab] = useState('student');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, backendAvailable } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const success = await login(activeTab, email, password);
      if (success) {
        navigate(`/${activeTab}`);
      } else {
        setError('Invalid credentials.');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: 'student', label: 'Student', icon: '🎓' },
    { key: 'teacher', label: 'Teacher', icon: '👩‍🏫' },
    { key: 'admin', label: 'Admin', icon: '👨‍💼' },
  ];

  const placeholders = {
    student: 'University Roll Number',
    teacher: 'Employee ID',
    admin: 'Admin Email',
  };

  return (
    <div className="login-page">
      <div className="login-branding">
        <div className="branding-content">
          <div className="brand-logo">
            <div className="brand-logo-circle">M</div>
          </div>
          <h1 className="brand-title">Student Attendance Management System</h1>
          <p className="brand-subtitle">Track · Manage · Report</p>
          <div className="brand-illustration">
            <div className="illust-item">📚</div>
            <div className="illust-item">🎓</div>
            <div className="illust-item">📅</div>
            <div className="illust-item">📊</div>
          </div>
          <p className="brand-footer">Empowering Education Through Technology</p>
        </div>
        <div className="brand-decoration">
          <div className="deco-circle deco-1"></div>
          <div className="deco-circle deco-2"></div>
          <div className="deco-circle deco-3"></div>
        </div>
      </div>

      <div className="login-form-panel">
        <div className="login-help">
          <a href="#help">Need Help?</a>
        </div>

        <div className="login-form-container">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-desc">Sign in to access your dashboard</p>

          <div className="login-tabs">
            {tabs.map(tab => (
              <button key={tab.key}
                className={`login-tab ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => { setActiveTab(tab.key); setError(''); }}>
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>{placeholders[activeTab]}</label>
              <div className="input-icon-wrap">
                <span className="input-icon">👤</span>
                <input type="text" placeholder={`Enter ${placeholders[activeTab]}`}
                  value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-icon-wrap">
                <span className="input-icon">🔒</span>
                <input type={showPwd ? 'text' : 'password'} placeholder="Enter Password"
                  value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" className="pwd-toggle" onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="form-row">
              <label className="checkbox-label">
                <input type="checkbox" /> Remember me
              </label>
              <a href="#forgot" className="forgot-link">Forgot Password?</a>
            </div>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="btn btn-primary btn-block btn-lg login-btn" disabled={loading}>
              {loading ? '⏳ Signing In...' : 'Sign In'}
            </button>


          </form>

          <p className="login-hint">
            {backendAvailable
              ? '🟢 Backend connected — use real credentials to login'
              : '🟡 Demo mode — click Sign In with any credentials'}
          </p>
        </div>

        <div className="login-footer">
          © 2024 Student Attendance Management System. All rights reserved.
        </div>
      </div>
    </div>
  );
}
