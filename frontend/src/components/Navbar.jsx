import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HeartPulse, 
  User, 
  LogOut, 
  Calendar, 
  Menu, 
  X, 
  Stethoscope, 
  ShieldCheck, 
  UserCheck, 
  Layers,
  ChevronDown
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isPatient, isDoctor, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isDoctor) return '/doctor/dashboard';
    if (isPatient) return '/patient/dashboard';
    return '/login';
  };

  const getRoleBadge = () => {
    if (isAdmin) return <span className="badge badge-danger"><ShieldCheck size={12} /> Admin</span>;
    if (isDoctor) return <span className="badge badge-info"><Stethoscope size={12} /> Doctor</span>;
    if (isPatient) return <span className="badge badge-success"><UserCheck size={12} /> Patient</span>;
    return null;
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        maxWidth: '1350px',
        margin: '0 auto',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary-600), var(--primary-800))',
            color: '#ffffff',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(13, 148, 136, 0.3)'
          }}>
            <HeartPulse size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '4px' }}>
              MediCare <span style={{ color: 'var(--primary-600)' }}>OP+</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>
              Hospital OP & Doctor Availability
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
          <Link 
            to="/" 
            style={{ 
              fontWeight: 600, 
              fontSize: '0.95rem',
              color: isActive('/') ? 'var(--primary-700)' : 'var(--text-main)',
              padding: '0.4rem 0.6rem',
              borderRadius: '6px',
              backgroundColor: isActive('/') ? 'var(--primary-50)' : 'transparent'
            }}
          >
            Home
          </Link>
          <Link 
            to="/departments" 
            style={{ 
              fontWeight: 600, 
              fontSize: '0.95rem',
              color: isActive('/departments') ? 'var(--primary-700)' : 'var(--text-main)',
              padding: '0.4rem 0.6rem',
              borderRadius: '6px',
              backgroundColor: isActive('/departments') ? 'var(--primary-50)' : 'transparent'
            }}
          >
            Departments
          </Link>
          <Link 
            to="/doctors" 
            style={{ 
              fontWeight: 600, 
              fontSize: '0.95rem',
              color: isActive('/doctors') ? 'var(--primary-700)' : 'var(--text-main)',
              padding: '0.4rem 0.6rem',
              borderRadius: '6px',
              backgroundColor: isActive('/doctors') ? 'var(--primary-50)' : 'transparent'
            }}
          >
            Find Doctors
          </Link>

          {/* If Patient */}
          {isAuthenticated && isPatient && (
            <>
              <Link 
                to="/patient/appointments" 
                style={{ 
                  fontWeight: 600, 
                  fontSize: '0.95rem',
                  color: isActive('/patient/appointments') ? 'var(--primary-700)' : 'var(--text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Calendar size={16} /> My OP Registrations
              </Link>
              <Link 
                to="/op-registration" 
                className="btn btn-sm btn-primary"
                style={{ borderRadius: '8px' }}
              >
                + Register for OP
              </Link>
            </>
          )}

          {/* If Doctor */}
          {isAuthenticated && isDoctor && (
            <Link 
              to="/doctor/dashboard" 
              style={{ 
                fontWeight: 600, 
                fontSize: '0.95rem',
                color: 'var(--primary-700)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Stethoscope size={16} /> Doctor Dashboard
            </Link>
          )}

          {/* If Admin */}
          {isAuthenticated && isAdmin && (
            <Link 
              to="/admin/dashboard" 
              style={{ 
                fontWeight: 600, 
                fontSize: '0.95rem',
                color: 'var(--primary-700)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <ShieldCheck size={16} /> Admin Portal
            </Link>
          )}
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {!isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link to="/op-registration" className="btn btn-primary btn-sm" style={{ display: 'inline-flex' }}>
                <Calendar size={15} /> Book OP
              </Link>
              <Link to="/login" className="btn btn-secondary btn-sm">
                <User size={15} /> Sign In
              </Link>
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-700)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.85rem'
                }}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div style={{ textAlign: 'left', display: 'none', lineHeight: '1.2' }} className="user-name-wrapper">
                  <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>{user?.name || 'User'}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user?.email}</div>
                </div>
                {getRoleBadge()}
                <ChevronDown size={14} color="var(--text-muted)" />
              </button>

              {dropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  width: '230px',
                  background: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-xl)',
                  padding: '0.5rem',
                  zIndex: 200
                }}>
                  <div style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{user?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</div>
                  </div>

                  <Link
                    to={getDashboardLink()}
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 0.75rem',
                      fontSize: '0.875rem',
                      color: 'var(--text-main)',
                      borderRadius: '6px',
                      marginTop: '0.25rem'
                    }}
                    className="dropdown-item"
                  >
                    <Layers size={16} /> My Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      fontSize: '0.875rem',
                      color: '#ef4444',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '6px',
                      textAlign: 'left'
                    }}
                  >
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.4rem',
              color: 'var(--text-main)'
            }}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid var(--border-color)',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/departments" onClick={() => setMobileMenuOpen(false)}>Departments</Link>
          <Link to="/doctors" onClick={() => setMobileMenuOpen(false)}>Find Doctors</Link>
          <Link to="/op-registration" onClick={() => setMobileMenuOpen(false)}>Register for OP</Link>
          {isAuthenticated && (
            <Link to={getDashboardLink()} onClick={() => setMobileMenuOpen(false)}>
              Go to Dashboard ({user?.role?.replace('ROLE_', '')})
            </Link>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
          .user-name-wrapper { display: block !important; }
        }
        .dropdown-item:hover {
          background-color: var(--primary-50);
          color: var(--primary-700);
        }
      `}</style>
    </header>
  );
};
