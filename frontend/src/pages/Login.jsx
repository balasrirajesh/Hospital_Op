import React, { useState } from 'react';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HeartPulse, 
  User, 
  Stethoscope, 
  ShieldCheck, 
  Lock, 
  Mail, 
  AlertCircle, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const Login = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'PATIENT'; // PATIENT | DOCTOR | ADMIN

  const [activeRole, setActiveRole] = useState(initialRole.toUpperCase());
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleTabChange = (role) => {
    setActiveRole(role);
    setError('');
  };

  // 1-Click Demo Credential Filler
  const handleFillDemo = (role) => {
    setActiveRole(role);
    setError('');
    if (role === 'PATIENT') {
      setEmail('patient@hospital.com');
      setPassword('patient123');
    } else if (role === 'DOCTOR') {
      setEmail('doctor.ravi@hospital.com');
      setPassword('doctor123');
    } else if (role === 'ADMIN') {
      setEmail('admin@hospital.com');
      setPassword('admin123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const authData = await login({
        email: email.trim(),
        password: password,
        role: `ROLE_${activeRole}`
      });

      // Role based routing
      if (authData.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else if (authData.role === 'ROLE_DOCTOR') {
        navigate('/doctor/dashboard');
      } else {
        const from = location.state?.from?.pathname || '/patient/dashboard';
        navigate(from);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid credentials. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '520px', padding: '3rem 1.5rem' }}>
      <div className="card" style={{ padding: '2.5rem', boxShadow: 'var(--shadow-xl)' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary-600), var(--primary-800))',
            color: '#ffffff',
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)'
          }}>
            <HeartPulse size={28} />
          </div>
          <h1 style={{ fontSize: '1.75rem', color: '#0f172a' }}>Hospital Portal Login</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Select your role to access your dedicated clinical dashboard
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.35rem',
          backgroundColor: '#f1f5f9',
          padding: '0.35rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem'
        }}>
          <button
            type="button"
            onClick={() => handleRoleTabChange('PATIENT')}
            style={{
              padding: '0.6rem 0.25rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeRole === 'PATIENT' ? '#ffffff' : 'transparent',
              color: activeRole === 'PATIENT' ? 'var(--primary-800)' : 'var(--text-muted)',
              fontWeight: '700',
              fontSize: '0.85rem',
              boxShadow: activeRole === 'PATIENT' ? 'var(--shadow-sm)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <User size={14} />
            <span>Patient</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleTabChange('DOCTOR')}
            style={{
              padding: '0.6rem 0.25rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeRole === 'DOCTOR' ? '#ffffff' : 'transparent',
              color: activeRole === 'DOCTOR' ? 'var(--primary-800)' : 'var(--text-muted)',
              fontWeight: '700',
              fontSize: '0.85rem',
              boxShadow: activeRole === 'DOCTOR' ? 'var(--shadow-sm)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <Stethoscope size={14} />
            <span>Doctor</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleTabChange('ADMIN')}
            style={{
              padding: '0.6rem 0.25rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeRole === 'ADMIN' ? '#ffffff' : 'transparent',
              color: activeRole === 'ADMIN' ? 'var(--primary-800)' : 'var(--text-muted)',
              fontWeight: '700',
              fontSize: '0.85rem',
              boxShadow: activeRole === 'ADMIN' ? 'var(--shadow-sm)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <ShieldCheck size={14} />
            <span>Admin</span>
          </button>
        </div>

        {/* 1-Click Demo Fillers */}
        <div style={{
          backgroundColor: 'var(--primary-50)',
          border: '1px solid var(--primary-200)',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem',
          marginBottom: '1.5rem',
          fontSize: '0.8rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-800)', fontWeight: '700', marginBottom: '0.4rem' }}>
            <Sparkles size={14} />
            <span>Quick Demo Logins (Click to autofill):</span>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleFillDemo('PATIENT')}
              className="btn btn-sm btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}
            >
              Patient Demo
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('DOCTOR')}
              className="btn btn-sm btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}
            >
              Doctor Demo
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('ADMIN')}
              className="btn btn-sm btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}
            >
              Admin Demo
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              {activeRole === 'DOCTOR' ? 'Doctor ID or Email' : 'Email Address'}
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder={activeRole === 'DOCTOR' ? 'DOC-101 or doctor@hospital.com' : 'you@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem' }}
            disabled={loading}
          >
            <span>{loading ? 'Authenticating...' : `Sign In as ${activeRole.charAt(0) + activeRole.slice(1).toLowerCase()}`}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {activeRole === 'PATIENT' && (
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            New patient?{' '}
            <Link to="/register" style={{ color: 'var(--primary-700)', fontWeight: '700' }}>
              Register for an account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
