import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/appointmentService';
import { OpSlipModal } from '../../components/OpSlipModal';
import { Link } from 'react-router-dom';
import { 
  CalendarCheck, 
  Search, 
  Printer, 
  XCircle, 
  FileText, 
  Calendar, 
  AlertCircle,
  Plus
} from 'lucide-react';

export const PatientAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [cancelModalAppt, setCancelModalAppt] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const fetchAppointments = async () => {
    if (!user?.patientId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await appointmentService.getPatientAppointments(user.patientId);
      setAppointments(data);
    } catch (err) {
      console.error('Error loading patient appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    if (!cancelModalAppt) return;
    setCancelling(true);
    try {
      await appointmentService.cancelAppointment(cancelModalAppt.id, cancelReason);
      setCancelModalAppt(null);
      setCancelReason('');
      fetchAppointments();
    } catch (err) {
      console.error('Cancellation error:', err);
      alert(err.response?.data?.message || 'Failed to cancel appointment.');
    } finally {
      setCancelling(false);
    }
  };

  const filteredAppts = appointments.filter((a) => {
    if (filterStatus !== 'ALL' && a.status !== filterStatus) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const op = (a.opNumber || '').toLowerCase();
      const doc = (a.doctorName || '').toLowerCase();
      const dept = (a.departmentName || '').toLowerCase();
      return op.includes(term) || doc.includes(term) || dept.includes(term);
    }
    return true;
  });

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
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-700)', fontWeight: '700', fontSize: '0.875rem' }}>
            <CalendarCheck size={16} />
            <span>Consultation Records</span>
          </div>
          <h1 style={{ fontSize: '2rem', marginTop: '0.2rem' }}>My OP Registrations</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Track appointment status, download official OP slips, or manage upcoming visits.
          </p>
        </div>

        <Link to="/op-registration" className="btn btn-primary">
          <Plus size={16} />
          <span>Register for New OP</span>
        </Link>
      </div>

      {/* Filter and Search */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['ALL', 'CONFIRMED', 'WAITING', 'COMPLETED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                style={{
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  padding: '0.4rem 0.9rem',
                  borderRadius: 'var(--radius-full)',
                  border: filterStatus === st ? '1px solid var(--primary-700)' : '1px solid var(--border-color)',
                  backgroundColor: filterStatus === st ? 'var(--primary-700)' : '#ffffff',
                  color: filterStatus === st ? '#ffffff' : 'var(--text-main)',
                  cursor: 'pointer'
                }}
              >
                {st === 'ALL' ? 'All Registrations' : st.charAt(0) + st.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search OP # or Doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.25rem', padding: '0.45rem 0.75rem 0.45rem 2.25rem', fontSize: '0.85rem' }}
            />
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="custom-table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>OP Number</th>
              <th>Doctor</th>
              <th>Department</th>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>
                  Loading your OP registrations...
                </td>
              </tr>
            ) : filteredAppts.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No OP registrations found for the selected filter.
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
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>
                      {appt.doctorName || appt.doctor?.user?.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {appt.doctorQualification || appt.doctor?.qualification}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-info">
                      {appt.departmentName || appt.doctor?.department?.name || 'General'}
                    </span>
                  </td>
                  <td>
                    <strong>{appt.appointmentDate}</strong>
                  </td>
                  <td>
                    <span style={{ color: 'var(--primary-800)', fontWeight: '600' }}>
                      {appt.appointmentTime}
                    </span>
                  </td>
                  <td>
                    {getStatusBadge(appt.status)}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => setSelectedSlip(appt)}
                        className="btn btn-secondary btn-sm"
                        title="Print / View OP Slip"
                      >
                        <Printer size={14} />
                        <span>Slip</span>
                      </button>

                      {appt.status === 'CONFIRMED' && (
                        <button
                          onClick={() => setCancelModalAppt(appt)}
                          className="btn btn-sm"
                          style={{ backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca' }}
                          title="Cancel OP Registration"
                        >
                          <XCircle size={14} />
                          <span>Cancel</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Print OP Slip Modal */}
      {selectedSlip && (
        <OpSlipModal
          appointment={selectedSlip}
          onClose={() => setSelectedSlip(null)}
        />
      )}

      {/* Cancel Appointment Modal */}
      {cancelModalAppt && (
        <div className="modal-overlay" onClick={() => setCancelModalAppt(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="card-header">
              <h3 style={{ fontSize: '1.15rem', color: '#b91c1c' }}>Cancel OP Registration</h3>
              <button 
                onClick={() => setCancelModalAppt(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.25rem' }}
              >
                ✕
              </button>
            </div>
            <div className="card-body">
              <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '1rem' }}>
                Are you sure you want to cancel your consultation for <strong>{cancelModalAppt.opNumber}</strong> on <strong>{cancelModalAppt.appointmentDate}</strong> at <strong>{cancelModalAppt.appointmentTime}</strong>?
              </p>

              <form onSubmit={handleCancelSubmit}>
                <div className="form-group">
                  <label className="form-label">Reason for Cancellation (Optional)</label>
                  <textarea
                    rows="2"
                    placeholder="e.g. Schedule conflict / Health improved / Rescheduled..."
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="form-control"
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setCancelModalAppt(null)}
                    className="btn btn-secondary"
                    disabled={cancelling}
                  >
                    Keep Appointment
                  </button>
                  <button
                    type="submit"
                    className="btn btn-danger"
                    disabled={cancelling}
                  >
                    {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
