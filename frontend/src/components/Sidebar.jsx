import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Calendar, 
  User, 
  Clock, 
  Users, 
  Building2, 
  Stethoscope, 
  FileText, 
  LogOut, 
  Settings,
  CalendarCheck,
  CalendarOff
} from 'lucide-react';

export const Sidebar = () => {
  const { user, isPatient, isDoctor, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="dashboard-sidebar">
      {/* User Info Header */}
      <div style={{
        padding: '1rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--primary-50)',
        border: '1px solid var(--primary-100)',
        marginBottom: '1rem'
      }}>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '700', color: 'var(--primary-800)', letterSpacing: '0.05em' }}>
          {isPatient && 'Patient Portal'}
          {isDoctor && 'Doctor Clinic Portal'}
          {isAdmin && 'Hospital Administrator'}
        </div>
        <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--primary-950)', marginTop: '0.2rem' }}>
          {user?.name || 'User'}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {user?.email}
        </div>
      </div>

      {/* Patient Menu */}
      {isPatient && (
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
          <NavLink 
            to="/patient/dashboard" 
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink 
            to="/op-registration" 
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <Calendar size={18} />
            <span>Register for OP</span>
          </NavLink>
          <NavLink 
            to="/patient/appointments" 
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <CalendarCheck size={18} />
            <span>My OP History</span>
          </NavLink>
          <NavLink 
            to="/doctors" 
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <Stethoscope size={18} />
            <span>Find Doctors</span>
          </NavLink>
          <NavLink 
            to="/patient/profile" 
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <User size={18} />
            <span>My Profile</span>
          </NavLink>
        </nav>
      )}

      {/* Doctor Menu */}
      {isDoctor && (
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
          <NavLink 
            to="/doctor/dashboard" 
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} />
            <span>Today's OP Queue</span>
          </NavLink>
          <NavLink 
            to="/doctor/schedule" 
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <Clock size={18} />
            <span>Timings & Slots</span>
          </NavLink>
          <NavLink 
            to="/doctor/profile" 
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <User size={18} />
            <span>Doctor Profile</span>
          </NavLink>
        </nav>
      )}

      {/* Admin Menu */}
      {isAdmin && (
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
          <NavLink 
            to="/admin/dashboard" 
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} />
            <span>Overview & KPIs</span>
          </NavLink>
          <NavLink 
            to="/admin/appointments" 
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <FileText size={18} />
            <span>OP Registrations</span>
          </NavLink>
          <NavLink 
            to="/admin/departments" 
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <Building2 size={18} />
            <span>Departments</span>
          </NavLink>
          <NavLink 
            to="/admin/doctors" 
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <Stethoscope size={18} />
            <span>Doctors Directory</span>
          </NavLink>
          <NavLink 
            to="/admin/schedules" 
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <Clock size={18} />
            <span>Schedule Oversight</span>
          </NavLink>
          <NavLink 
            to="/admin/patients" 
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <Users size={18} />
            <span>Patient Records</span>
          </NavLink>
        </nav>
      )}

      {/* Bottom Logout Button */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: 'auto' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'transparent',
            border: 'none',
            color: '#ef4444',
            fontWeight: '600',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
