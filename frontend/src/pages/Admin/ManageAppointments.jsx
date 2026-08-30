import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { doctorService } from '../../services/doctorService';
import { departmentService } from '../../services/departmentService';
import { OpSlipModal } from '../../components/OpSlipModal';
import { 
  FileText, 
  Search, 
  Filter, 
  Printer, 
  Calendar, 
  User, 
  Building2, 
  Stethoscope, 
  CheckCircle2, 
  XCircle, 
  RefreshCw 
} from 'lucide-react';

export const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDoctor, setFilterDoctor] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [selectedSlip, setSelectedSlip] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchMasterAppointments = async () => {
    setLoading(true);
    try {
      const [appts, docs, depts] = await Promise.all([
        appointmentService.getAllAppointments({
          doctorId: filterDoctor || undefined,
          departmentId: filterDept || undefined,
          date: filterDate || undefined,
          status: filterStatus || undefined
        }),
        doctorService.getAllDoctors(),
        departmentService.getAllDepartments()
      ]);
      setAppointments(appts);
      setDoctors(docs);
      setDepartments(depts);
    } catch (err) {
      console.error('Error fetching master appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterAppointments();
  }, [filterDoctor, filterDept, filterDate, filterStatus]);

  const handleStatusChange = async (apptId, newStatus) => {
    setUpdatingId(apptId);
    try {
      await appointmentService.updateStatus(apptId, { status: newStatus });
      setAppointments(appointments.map((a) => a.id === apptId ? { ...a, status: newStatus } : a));
    } catch (err) {
      console.error('Update status failed:', err);
      alert('Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterDoctor('');
    setFilterDept('');
    setFilterDate('');
    setFilterStatus('');
  };

  const filteredAppts = appointments.filter((a) => {
    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      const op = (a.opNumber || '').toLowerCase();
      const pat = (a.patientName || a.patient?.user?.name || '').toLowerCase();
      const phone = (a.patientPhone || a.patient?.user?.phone || '').toLowerCase();
      return op.includes(term) || pat.includes(term) || phone.includes(term);
    }
    return true;
  });

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
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-700)', fontWeight: '700', fontSize: '0.875rem' }}>
            <FileText size={16} />
            <span>Master Records</span>
          </div>
          <h1 style={{ fontSize: '2rem', marginTop: '0.2rem' }}>OP Registrations Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Filter by OP token, patient, doctor, date range, and manage live outpatient statuses.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          alignItems: 'flex-end'
        }}>
          {/* Search OP or Patient */}
          <div>
            <label className="form-label">Search OP # or Patient</label>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="OP-2026-..., Name, Phone"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '2.25rem', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {/* Filter Doctor */}
          <div>
            <label className="form-label">Doctor</label>
            <select
              value={filterDoctor}
              onChange={(e) => setFilterDoctor(e.target.value)}
              className="form-select"
              style={{ fontSize: '0.85rem' }}
            >
              <option value="">All Doctors</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>{doc.name}</option>
              ))}
            </select>
          </div>

          {/* Filter Department */}
          <div>
            <label className="form-label">Department</label>
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="form-select"
              style={{ fontSize: '0.85rem' }}
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Filter Date */}
          <div>
            <label className="form-label">Date</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="form-control"
              style={{ fontSize: '0.85rem' }}
            />
          </div>

          {/* Filter Status */}
          <div>
            <label className="form-label">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-select"
              style={{ fontSize: '0.85rem' }}
            >
              <option value="">All Statuses</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="WAITING">Waiting</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <button
              onClick={handleResetFilters}
              className="btn btn-secondary"
              style={{ width: '100%', fontSize: '0.85rem' }}
            >
              <RefreshCw size={14} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="custom-table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>OP Number</th>
              <th>Patient Information</th>
              <th>Doctor</th>
              <th>Department</th>
              <th>Schedule</th>
              <th>Status</th>
              <th>Change Status</th>
              <th style={{ textAlign: 'right' }}>Slip</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '3rem' }}>
                  Loading OP registrations...
                </td>
              </tr>
            ) : filteredAppts.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No OP registrations matching your criteria.
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
                      {appt.patientName || appt.patient?.user?.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {appt.patientAge || '30'} Yrs / {appt.patientGender || 'Male'} • {appt.patientPhone}
                    </div>
                  </td>
                  <td>{appt.doctorName || appt.doctor?.user?.name}</td>
                  <td>
                    <span className="badge badge-info">{appt.departmentName || appt.doctor?.department?.name || 'General'}</span>
                  </td>
                  <td>
                    <div><strong>{appt.appointmentDate}</strong></div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--primary-800)' }}>{appt.appointmentTime}</div>
                  </td>
                  <td>{getStatusBadge(appt.status)}</td>
                  <td>
                    <select
                      value={appt.status}
                      onChange={(e) => handleStatusChange(appt.id, e.target.value)}
                      disabled={updatingId === appt.id}
                      className="form-select"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', minWidth: '110px' }}
                    >
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="WAITING">WAITING</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedSlip(appt)}
                      className="btn btn-secondary btn-sm"
                      title="Print Slip"
                    >
                      <Printer size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Slip Modal */}
      {selectedSlip && (
        <OpSlipModal
          appointment={selectedSlip}
          onClose={() => setSelectedSlip(null)}
        />
      )}
    </div>
  );
};
