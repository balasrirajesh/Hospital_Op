import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/appointmentService';
import { StatsCard } from '../../components/StatsCard';
import { OpSlipModal } from '../../components/OpSlipModal';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Search, 
  FileText, 
  Printer, 
  UserCheck, 
  ChevronRight,
  Activity
} from 'lucide-react';

export const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [slipAppt, setSlipAppt] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchDoctorAppointments = async () => {
    if (!user?.doctorId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await appointmentService.getDoctorAppointments(user.doctorId, {
        date: selectedDate
      });
      setAppointments(data);
    } catch (err) {
      console.error('Error loading doctor queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorAppointments();
  }, [user, selectedDate]);

  const handleUpdateStatus = async (apptId, newStatus) => {
    setUpdatingId(apptId);
    try {
      await appointmentService.updateStatus(apptId, { status: newStatus });
      // Optimistic update
      setAppointments(appointments.map((a) => a.id === apptId ? { ...a, status: newStatus } : a));
    } catch (err) {
      console.error('Status update failed:', err);
      alert('Failed to update patient consultation status.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Metrics calculation
  const totalToday = appointments.length;
  const waitingCount = appointments.filter((a) => a.status === 'CONFIRMED' || a.status === 'WAITING').length;
  const completedCount = appointments.filter((a) => a.status === 'COMPLETED' || a.status === 'VISITED').length;
  const cancelledCount = appointments.filter((a) => a.status === 'CANCELLED').length;

  const filteredAppts = appointments.filter((a) => {
    if (filterStatus === 'WAITING') return a.status === 'WAITING' || a.status === 'CONFIRMED';
    if (filterStatus === 'COMPLETED') return a.status === 'COMPLETED' || a.status === 'VISITED';
    if (filterStatus === 'CANCELLED') return a.status === 'CANCELLED';
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="badge badge-primary">● Confirmed</span>;
      case 'WAITING':
        return <span className="badge badge-warning">● Waiting in OP</span>;
      case 'VISITED':
      case 'COMPLETED':
        return <span className="badge badge-success">● Completed</span>;
      case 'CANCELLED':
        return <span className="badge badge-danger">● Cancelled</span>;
      default:
        return <span className="badge badge-primary">{status}</span>;
    }
  };

  return (
    <div className="dashboard-main">
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f766e 0%, #042f2e 100%)',
        color: '#ffffff',
        padding: '2rem 2.5rem',
        borderRadius: 'var(--radius-xl)',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#5eead4', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Doctor Clinical Portal
          </div>
          <h1 style={{ fontSize: '2rem', color: '#ffffff', marginTop: '0.25rem', marginBottom: '0.4rem' }}>
            {user?.name || 'Dr. Practitioner'}
          </h1>
          <p style={{ color: '#ccfbf1', fontSize: '0.925rem' }}>
            {user?.specialization || 'Clinical Specialist'} • Today's Consultation Date: <strong>{selectedDate}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)' }}>
          <Calendar size={18} color="#5eead4" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontWeight: '700',
              outline: 'none',
              cursor: 'pointer'
            }}
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <StatsCard
          title="Today's OP Registrations"
          value={totalToday}
          subtitle={`Patients booked for ${selectedDate}`}
          icon={Users}
          color="var(--primary-700)"
          bgColor="var(--primary-50)"
        />
        <StatsCard
          title="Waiting in Queue"
          value={waitingCount}
          subtitle="Patients awaiting consultation"
          icon={Clock}
          color="#b45309"
          bgColor="#fffbeb"
        />
        <StatsCard
          title="Consultations Completed"
          value={completedCount}
          subtitle="Successfully examined"
          icon={CheckCircle2}
          color="#047857"
          bgColor="#ecfdf5"
        />
        <StatsCard
          title="Cancelled Registrations"
          value={cancelledCount}
          subtitle="Rescheduled or cancelled"
          icon={AlertCircle}
          color="#b91c1c"
          bgColor="#fef2f2"
        />
      </div>

      {/* Queue Table */}
      <div className="card">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} color="var(--primary-600)" />
            <h3 style={{ fontSize: '1.25rem' }}>Today's OP Patient Queue</h3>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['ALL', 'WAITING', 'COMPLETED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                style={{
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  padding: '0.35rem 0.8rem',
                  borderRadius: 'var(--radius-full)',
                  border: filterStatus === st ? '1px solid var(--primary-700)' : '1px solid var(--border-color)',
                  backgroundColor: filterStatus === st ? 'var(--primary-700)' : '#ffffff',
                  color: filterStatus === st ? '#ffffff' : 'var(--text-main)',
                  cursor: 'pointer'
                }}
              >
                {st === 'ALL' ? 'All Patients' : st.charAt(0) + st.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="custom-table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>OP Token</th>
                <th>Time</th>
                <th>Patient Name</th>
                <th>Age / Gender</th>
                <th>Reason / Complaint</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Consultation Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>
                    Loading patient queue...
                  </td>
                </tr>
              ) : filteredAppts.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No patients found in queue for {selectedDate} with status: {filterStatus}.
                  </td>
                </tr>
              ) : (
                filteredAppts.map((appt) => (
                  <tr key={appt.id}>
                    <td>
                      <span style={{ fontWeight: '800', color: 'var(--primary-900)' }}>
                        {appt.opNumber || `OP-2026-000${appt.id}`}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--primary-800)' }}>{appt.appointmentTime}</strong>
                    </td>
                    <td>
                      <div style={{ fontWeight: '700', color: '#0f172a' }}>
                        {appt.patientName || appt.patient?.user?.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Ph: {appt.patientPhone || appt.patient?.user?.phone || 'N/A'}
                      </div>
                    </td>
                    <td>
                      {appt.patientAge || appt.patient?.age || '30'} Yrs / {appt.patientGender || appt.patient?.gender || 'Male'}
                    </td>
                    <td style={{ maxWidth: '240px' }}>
                      <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{appt.reason}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {appt.symptoms || 'General OP Checkup'}
                      </div>
                    </td>
                    <td>
                      {getStatusBadge(appt.status)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                        {appt.status !== 'COMPLETED' && (
                          <button
                            onClick={() => handleUpdateStatus(appt.id, 'WAITING')}
                            className="btn btn-sm"
                            style={{ backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}
                            disabled={updatingId === appt.id}
                            title="Mark as Waiting in Room"
                          >
                            Waiting
                          </button>
                        )}

                        {appt.status !== 'COMPLETED' && (
                          <button
                            onClick={() => handleUpdateStatus(appt.id, 'COMPLETED')}
                            className="btn btn-sm btn-primary"
                            disabled={updatingId === appt.id}
                            title="Mark Consultation Visited & Completed"
                          >
                            <CheckCircle2 size={13} />
                            <span>Complete</span>
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedAppt(appt)}
                          className="btn btn-secondary btn-sm"
                          title="View Details"
                        >
                          <FileText size={13} />
                          <span>Details</span>
                        </button>

                        <button
                          onClick={() => setSlipAppt(appt)}
                          className="btn btn-secondary btn-sm"
                          title="Print OP Slip"
                        >
                          <Printer size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Detail Modal */}
      {selectedAppt && (
        <div className="modal-overlay" onClick={() => setSelectedAppt(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="card-header">
              <h3 style={{ fontSize: '1.25rem' }}>Patient Clinical Record</h3>
              <button 
                onClick={() => setSelectedAppt(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.25rem' }}
              >
                ✕
              </button>
            </div>
            <div className="card-body">
              <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', fontSize: '0.9rem' }}>
                  <div><strong>Patient:</strong> {selectedAppt.patientName}</div>
                  <div><strong>Age/Gender:</strong> {selectedAppt.patientAge} Yrs / {selectedAppt.patientGender}</div>
                  <div><strong>Phone:</strong> {selectedAppt.patientPhone}</div>
                  <div><strong>OP Number:</strong> {selectedAppt.opNumber}</div>
                  <div><strong>Date & Time:</strong> {selectedAppt.appointmentDate} at {selectedAppt.appointmentTime}</div>
                  <div><strong>Status:</strong> {getStatusBadge(selectedAppt.status)}</div>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>Primary Reason</h4>
                <p style={{ color: '#334155', fontSize: '0.9rem' }}>{selectedAppt.reason || 'N/A'}</p>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>Symptoms / Complaint</h4>
                <p style={{ color: '#334155', fontSize: '0.9rem' }}>{selectedAppt.symptoms || 'No additional symptoms reported.'}</p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>Previous Medical History / Allergies</h4>
                <p style={{ color: '#334155', fontSize: '0.9rem' }}>{selectedAppt.previousMedicalHistory || 'None noted.'}</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  onClick={() => {
                    handleUpdateStatus(selectedAppt.id, 'COMPLETED');
                    setSelectedAppt(null);
                  }}
                  className="btn btn-primary"
                >
                  <CheckCircle2 size={16} />
                  <span>Mark as Completed</span>
                </button>
                <button onClick={() => setSelectedAppt(null)} className="btn btn-secondary">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OP Slip Modal */}
      {slipAppt && (
        <OpSlipModal
          appointment={slipAppt}
          onClose={() => setSlipAppt(null)}
        />
      )}
    </div>
  );
};
