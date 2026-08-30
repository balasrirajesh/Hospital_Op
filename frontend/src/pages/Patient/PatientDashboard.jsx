import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/appointmentService';
import { doctorService } from '../../services/doctorService';
import { departmentService } from '../../services/departmentService';
import { StatsCard } from '../../components/StatsCard';
import { DoctorCard } from '../../components/DoctorCard';
import { OpSlipModal } from '../../components/OpSlipModal';
import { 
  Calendar, 
  CalendarCheck, 
  Stethoscope, 
  Building2, 
  Clock, 
  FileText, 
  Printer, 
  ArrowRight,
  UserCheck,
  AlertCircle
} from 'lucide-react';

export const PatientDashboard = () => {
  const { user } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [topDoctors, setTopDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedSlipAppointment, setSelectedSlipAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [appts, docs, depts] = await Promise.all([
          user?.patientId ? appointmentService.getPatientAppointments(user.patientId).catch(() => []) : [],
          doctorService.getAllDoctors().catch(() => []),
          departmentService.getAllDepartments().catch(() => [])
        ]);

        const today = new Date().toISOString().split('T')[0];
        const upcoming = appts.filter((a) => a.appointmentDate >= today && a.status !== 'CANCELLED');
        const history = appts.filter((a) => a.appointmentDate < today || a.status === 'COMPLETED' || a.status === 'CANCELLED');

        setUpcomingAppointments(upcoming.slice(0, 3));
        setRecentAppointments(appts.slice(0, 5));
        setTopDoctors(docs.slice(0, 3));
        setDepartments(depts.slice(0, 4));
      } catch (err) {
        console.error('Error fetching patient dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="badge badge-success">● Confirmed</span>;
      case 'WAITING':
        return <span className="badge badge-warning">● Waiting</span>;
      case 'COMPLETED':
        return <span className="badge badge-info">● Completed</span>;
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
        background: 'linear-gradient(135deg, var(--primary-700), var(--primary-900))',
        color: '#ffffff',
        padding: '2rem 2.5rem',
        borderRadius: 'var(--radius-xl)',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
        boxShadow: 'var(--shadow-teal)'
      }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--primary-300)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Patient Out-Patient Portal
          </div>
          <h1 style={{ fontSize: '2rem', color: '#ffffff', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
            Welcome back, {user?.name || 'Patient'}!
          </h1>
          <p style={{ color: '#ccfbf1', fontSize: '0.95rem', maxWidth: '540px' }}>
            Find hospital specialist doctors, check real-time consultation timings, and manage your OP registrations online.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/op-registration" className="btn btn-primary btn-lg" style={{ backgroundColor: 'var(--primary-500)' }}>
            <Calendar size={18} />
            <span>Book New OP</span>
          </Link>
          <Link to="/doctors" className="btn btn-secondary btn-lg">
            <Stethoscope size={18} />
            <span>Find Doctors</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stats-grid">
        <StatsCard
          title="Upcoming OP Appointments"
          value={upcomingAppointments.length}
          subtitle="Scheduled consultations"
          icon={CalendarCheck}
          color="var(--primary-700)"
          bgColor="var(--primary-50)"
        />
        <StatsCard
          title="Total OP Registrations"
          value={recentAppointments.length}
          subtitle="Lifetime hospital consultations"
          icon={FileText}
          color="var(--accent-600)"
          bgColor="var(--accent-50)"
        />
        <StatsCard
          title="Specialist Doctors"
          value="45+"
          subtitle="Available across all units"
          icon={Stethoscope}
          color="#059669"
          bgColor="#ecfdf5"
        />
        <StatsCard
          title="Medical Departments"
          value="14"
          subtitle="Full specialty coverage"
          icon={Building2}
          color="#7c3aed"
          bgColor="#f5f3ff"
        />
      </div>

      {/* Main Grid: Upcoming Consultations & Quick Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '2rem',
        marginBottom: '2.5rem'
      }}>
        {/* Upcoming Consultations */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CalendarCheck size={18} color="var(--primary-600)" />
              <h3 style={{ fontSize: '1.15rem' }}>Upcoming OP Appointments</h3>
            </div>
            <Link to="/patient/appointments" style={{ fontSize: '0.85rem', color: 'var(--primary-700)', fontWeight: '700' }}>
              View All History
            </Link>
          </div>

          <div className="card-body">
            {upcomingAppointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <Calendar size={36} color="var(--text-light)" style={{ margin: '0 auto 0.75rem' }} />
                <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>No Upcoming Appointments</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                  You don't have any pending OP registrations. Book a consultation today.
                </p>
                <Link to="/op-registration" className="btn btn-primary btn-sm">
                  Register for OP Now
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {upcomingAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#f8fafc',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span className="badge badge-primary">{appt.opNumber || `OP-2026-000${appt.id}`}</span>
                        {getStatusBadge(appt.status)}
                      </div>
                      <div style={{ fontWeight: '700', fontSize: '1rem', color: '#0f172a' }}>
                        {appt.doctorName || appt.doctor?.user?.name}
                      </div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--primary-800)', fontWeight: '600' }}>
                        {appt.departmentName || appt.doctor?.department?.name || 'General OP'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.4rem' }}>
                        <span>📅 {appt.appointmentDate}</span>
                        <span>⏰ {appt.appointmentTime}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedSlipAppointment(appt)}
                      className="btn btn-secondary btn-sm"
                    >
                      <Printer size={14} />
                      <span>Print Slip</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Departments & Find Doctors */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={18} color="var(--primary-600)" />
              <h3 style={{ fontSize: '1.15rem' }}>Browse Departments</h3>
            </div>
            <Link to="/departments" style={{ fontSize: '0.85rem', color: 'var(--primary-700)', fontWeight: '700' }}>
              All Departments
            </Link>
          </div>

          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              {departments.map((dept) => (
                <Link
                  key={dept.id}
                  to={`/doctors?departmentId=${dept.id}`}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                    transition: 'all 0.2s ease'
                  }}
                  className="card-interactive"
                >
                  <div style={{ fontWeight: '700', fontSize: '0.925rem', color: '#0f172a' }}>
                    {dept.name}
                  </div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--primary-700)', fontWeight: '600' }}>
                    View Doctors →
                  </div>
                </Link>
              ))}
            </div>

            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-50)',
              border: '1px solid var(--primary-200)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--primary-950)' }}>Need specialist advice?</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--primary-800)' }}>Check real-time schedule & book a slot</div>
              </div>
              <Link to="/doctors" className="btn btn-primary btn-sm">
                Find Doctors
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Available Specialist Doctors Section */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.4rem' }}>Available Specialist Doctors</h2>
          <Link to="/doctors" style={{ color: 'var(--primary-700)', fontWeight: '700', fontSize: '0.9rem' }}>
            View Full Doctors Directory →
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {topDoctors.map((doc) => (
            <DoctorCard key={doc.id} doctor={doc} />
          ))}
        </div>
      </div>

      {/* Print Slip Modal */}
      {selectedSlipAppointment && (
        <OpSlipModal
          appointment={selectedSlipAppointment}
          onClose={() => setSelectedSlipAppointment(null)}
        />
      )}
    </div>
  );
};
