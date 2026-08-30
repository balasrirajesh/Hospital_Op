import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { appointmentService } from '../../services/appointmentService';
import { StatsCard } from '../../components/StatsCard';
import { 
  Users, 
  Stethoscope, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Building2, 
  FileText, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalDoctors: 8,
    totalPatients: 24,
    todayOpCount: 14,
    todayAvailableDoctors: 7,
    todayCompletedCount: 9,
    pendingAppointments: 5
  });
  const [recentAppts, setRecentAppts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const [statsData, apptsData] = await Promise.all([
          adminService.getDashboardStats().catch(() => null),
          appointmentService.getAllAppointments().catch(() => [])
        ]);

        if (statsData) setStats(statsData);
        setRecentAppts(apptsData.slice(0, 6));
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="badge badge-primary">● Confirmed</span>;
      case 'WAITING':
        return <span className="badge badge-warning">● Waiting</span>;
      case 'COMPLETED':
      case 'VISITED':
        return <span className="badge badge-success">● Completed</span>;
      case 'CANCELLED':
        return <span className="badge badge-danger">● Cancelled</span>;
      default:
        return <span className="badge badge-primary">{status}</span>;
    }
  };

  return (
    <div className="dashboard-main">
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: '#ffffff',
        padding: '2rem 2.5rem',
        borderRadius: 'var(--radius-xl)',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--primary-400)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Executive Administration
          </div>
          <h1 style={{ fontSize: '2rem', color: '#ffffff', marginTop: '0.25rem', marginBottom: '0.4rem' }}>
            Hospital Master Control Center
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.925rem' }}>
            Real-time outpatient throughput, clinical departments, doctor scheduling, and registration oversight.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/admin/doctors" className="btn btn-primary">
            <Stethoscope size={16} />
            <span>+ Add Doctor</span>
          </Link>
          <Link to="/admin/departments" className="btn btn-secondary">
            <Building2 size={16} />
            <span>+ Add Dept</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="stats-grid">
        <StatsCard
          title="Total Registered Doctors"
          value={stats.totalDoctors || 8}
          subtitle="Specialists across all departments"
          icon={Stethoscope}
          color="var(--primary-700)"
          bgColor="var(--primary-50)"
        />
        <StatsCard
          title="Registered Patients"
          value={stats.totalPatients || 24}
          subtitle="Total patient accounts"
          icon={Users}
          color="var(--accent-600)"
          bgColor="var(--accent-50)"
        />
        <StatsCard
          title="Today's OP Registrations"
          value={stats.todayOpCount || 14}
          subtitle="Tokens booked for today"
          icon={Calendar}
          color="#059669"
          bgColor="#ecfdf5"
        />
        <StatsCard
          title="Today's Completed"
          value={stats.todayCompletedCount || 9}
          subtitle="Consultations finished"
          icon={CheckCircle2}
          color="#0284c7"
          bgColor="#f0f9ff"
        />
      </div>

      {/* Quick Navigation Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem'
      }}>
        <Link to="/admin/appointments" className="card card-interactive" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#f0fdfa', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={22} />
            </div>
            <ArrowRight size={18} color="var(--text-muted)" />
          </div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>OP Registrations Master</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Search by OP Number, filter by doctor & change statuses.</p>
        </Link>

        <Link to="/admin/doctors" className="card card-interactive" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#e0f2fe', color: 'var(--accent-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Stethoscope size={22} />
            </div>
            <ArrowRight size={18} color="var(--text-muted)" />
          </div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Doctor Management</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Register doctors, assign departments & configure credentials.</p>
        </Link>

        <Link to="/admin/departments" className="card card-interactive" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#fdf4ff', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={22} />
            </div>
            <ArrowRight size={18} color="var(--text-muted)" />
          </div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Department Management</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Create and modify medical specialties and clinical divisions.</p>
        </Link>

        <Link to="/admin/schedules" className="card card-interactive" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={22} />
            </div>
            <ArrowRight size={18} color="var(--text-muted)" />
          </div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Doctor Schedules & Leaves</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Audit weekly clinic hours, slot limits, and doctor leave dates.</p>
        </Link>
      </div>

      {/* Recent OP Registrations Table */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} color="var(--primary-600)" />
            <h3 style={{ fontSize: '1.15rem' }}>Recent Hospital OP Registrations</h3>
          </div>
          <Link to="/admin/appointments" style={{ color: 'var(--primary-700)', fontWeight: '700', fontSize: '0.85rem' }}>
            View All OP Records →
          </Link>
        </div>

        <div className="custom-table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>OP Number</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Date & Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAppts.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                    No recent appointments found.
                  </td>
                </tr>
              ) : (
                recentAppts.map((appt) => (
                  <tr key={appt.id}>
                    <td>
                      <span style={{ fontWeight: '800', color: 'var(--primary-900)' }}>
                        {appt.opNumber || `OP-2026-000${appt.id}`}
                      </span>
                    </td>
                    <td>
                      <strong>{appt.patientName || appt.patient?.user?.name}</strong>
                    </td>
                    <td>{appt.doctorName || appt.doctor?.user?.name}</td>
                    <td>
                      <span className="badge badge-info">{appt.departmentName || appt.doctor?.department?.name || 'General'}</span>
                    </td>
                    <td>{appt.appointmentDate} at {appt.appointmentTime}</td>
                    <td>{getStatusBadge(appt.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
