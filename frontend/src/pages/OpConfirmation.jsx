import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { appointmentService } from '../services/appointmentService';
import { OpSlipModal } from '../components/OpSlipModal';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircle2, 
  Printer, 
  Calendar, 
  Clock, 
  User, 
  Building2, 
  Stethoscope, 
  ArrowLeft, 
  Home, 
  FileText 
} from 'lucide-react';

export const OpConfirmation = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isPatient } = useAuth();

  const [appointment, setAppointment] = useState(location.state?.appointment || null);
  const [showSlipModal, setShowSlipModal] = useState(false);
  const [loading, setLoading] = useState(!appointment);

  const opNumber = searchParams.get('opNumber');

  useEffect(() => {
    if (!appointment && opNumber) {
      appointmentService.getAppointmentByOpNumber(opNumber)
        .then(setAppointment)
        .catch((err) => {
          console.error('Error fetching appointment:', err);
          // If not by OP number, try by ID
          if (!isNaN(opNumber)) {
            appointmentService.getAppointmentById(opNumber)
              .then(setAppointment)
              .catch(() => {});
          }
        })
        .finally(() => setLoading(false));
    }
  }, [opNumber, appointment]);

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <p style={{ color: 'var(--text-muted)' }}>Retrieving OP registration details...</p>
      </div>
    );
  }

  const appt = appointment || {
    opNumber: opNumber || 'OP-2026-000125',
    patientName: 'Ravi Kumar',
    doctorName: 'Dr. Ravi Kumar',
    departmentName: 'Cardiology',
    appointmentDate: '2026-08-30',
    appointmentTime: '10:30 AM',
    status: 'CONFIRMED'
  };

  return (
    <div className="page-container" style={{ maxWidth: '780px', padding: '3rem 1.5rem' }}>
      {/* Success Animation Header */}
      <div className="card" style={{ padding: '2.5rem', textAlign: 'center', borderTop: '6px solid #10b981', boxShadow: 'var(--shadow-xl)' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: '#ecfdf5',
          color: '#10b981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem',
          border: '2px solid #a7f3d0'
        }}>
          <CheckCircle2 size={40} />
        </div>

        <span className="badge badge-success" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
          Registration Confirmed
        </span>

        <h1 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '0.5rem' }}>
          OP REGISTRATION SUCCESSFUL
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 2rem' }}>
          Your hospital Out-Patient appointment has been registered in our system. Please save your OP Number for consultation check-in.
        </p>

        {/* OP Number Highlight Box */}
        <div style={{
          backgroundColor: '#f0fdfa',
          border: '2px dashed var(--primary-500)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.35rem'
        }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-800)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Official OP Registration Number
          </span>
          <span style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--primary-900)', letterSpacing: '1px' }}>
            {appt.opNumber || `OP-2026-000${appt.id || '125'}`}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--primary-700)' }}>
            Present this number or printable slip at the OP reception desk
          </span>
        </div>

        {/* Registration Summary Card */}
        <div style={{
          backgroundColor: '#f8fafc',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          border: '1px solid var(--border-color)',
          textAlign: 'left',
          marginBottom: '2rem'
        }}>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Appointment Summary
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            fontSize: '0.925rem'
          }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Patient Name</div>
              <div style={{ fontWeight: '700', color: '#0f172a' }}>{appt.patientName || appt.patient?.user?.name}</div>
            </div>

            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Department</div>
              <div style={{ fontWeight: '700', color: '#0f172a' }}>{appt.departmentName || appt.doctor?.department?.name || 'General'}</div>
            </div>

            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Doctor</div>
              <div style={{ fontWeight: '700', color: 'var(--primary-800)' }}>{appt.doctorName || appt.doctor?.user?.name}</div>
            </div>

            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Appointment Date</div>
              <div style={{ fontWeight: '700', color: '#0f172a' }}>{appt.appointmentDate}</div>
            </div>

            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Consultation Time</div>
              <div style={{ fontWeight: '700', color: '#0f172a' }}>{appt.appointmentTime}</div>
            </div>

            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Status</div>
              <div style={{ fontWeight: '700', color: '#10b981' }}>🟢 {appt.status || 'Confirmed'}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <button
            onClick={() => setShowSlipModal(true)}
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.5rem' }}
          >
            <Printer size={18} />
            <span>Print OP Slip</span>
          </button>

          {isPatient ? (
            <Link to="/patient/appointments" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>
              <FileText size={18} />
              <span>View My Appointments</span>
            </Link>
          ) : (
            <button
              onClick={() => setShowSlipModal(true)}
              className="btn btn-secondary"
              style={{ padding: '0.75rem 1.5rem' }}
            >
              <FileText size={18} />
              <span>View Appointment Slip</span>
            </button>
          )}

          <Link to={isPatient ? "/patient/dashboard" : "/"} className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>
            <Home size={18} />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Printable OP Slip Modal */}
      {showSlipModal && (
        <OpSlipModal
          appointment={appt}
          onClose={() => setShowSlipModal(false)}
        />
      )}
    </div>
  );
};
