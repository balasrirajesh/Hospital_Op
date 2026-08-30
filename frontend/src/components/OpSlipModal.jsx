import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  HeartPulse, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  User, 
  Building2, 
  Stethoscope, 
  FileText 
} from 'lucide-react';

export const OpSlipModal = ({ appointment, onClose }) => {
  const printRef = useRef();

  if (!appointment) return null;

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="badge badge-success">● Confirmed</span>;
      case 'WAITING':
        return <span className="badge badge-warning">● Waiting in OP</span>;
      case 'COMPLETED':
        return <span className="badge badge-info">● Completed</span>;
      case 'CANCELLED':
        return <span className="badge badge-danger">● Cancelled</span>;
      default:
        return <span className="badge badge-primary">{status}</span>;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '680px' }}
      >
        {/* Modal Top Actions (no-print) */}
        <div className="no-print" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', color: 'var(--primary-800)' }}>
            <FileText size={18} />
            <span>Out-Patient (OP) Consultation Slip</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              onClick={handlePrint} 
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Printer size={15} />
              <span>Print OP Slip</span>
            </button>
            <button 
              onClick={onClose} 
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: '4px'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="printable-slip-area" ref={printRef} style={{ padding: '2rem' }}>
          <div className="op-slip-card">
            {/* Header */}
            <div className="op-slip-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  background: '#0d9488',
                  color: '#ffffff',
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <HeartPulse size={26} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.35rem', color: '#0f172a', fontWeight: '800' }}>
                    MEDICARE MULTISPECIALTY HOSPITAL
                  </h2>
                  <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                    124 Healthcare Avenue, Medical District • Tel: +1 (800) 456-7890
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary-700)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  OP REGISTRATION SLIP
                </div>
                <div style={{ marginTop: '4px' }}>
                  {getStatusBadge(appointment.status)}
                </div>
              </div>
            </div>

            {/* OP Token & Barcode Section */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f0fdfa',
              border: '1px solid #99f6e4',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#0f766e', textTransform: 'uppercase' }}>
                  OP Registration Number
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#134e4a', letterSpacing: '1px' }}>
                  {appointment.opNumber || `OP-2026-000${appointment.id}`}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="barcode-placeholder" />
                <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '2px', letterSpacing: '1px' }}>
                  *{appointment.opNumber || `OP-${appointment.id}`}*
                </div>
              </div>
            </div>

            {/* Patient & Appointment Details Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1.25rem',
              marginBottom: '1.5rem',
              fontSize: '0.875rem'
            }}>
              {/* Left: Patient Details */}
              <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: '700', color: '#0f172a', marginBottom: '0.6rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <User size={15} color="var(--primary-600)" />
                  <span>Patient Information</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '0.4rem', color: '#334155' }}>
                  <span style={{ color: '#64748b' }}>Name:</span>
                  <strong>{appointment.patientName || appointment.patient?.user?.name}</strong>
                  
                  <span style={{ color: '#64748b' }}>Age / Gender:</span>
                  <span>{appointment.patientAge || appointment.patient?.age || '32'} Yrs / {appointment.patientGender || appointment.patient?.gender || 'Male'}</span>
                  
                  <span style={{ color: '#64748b' }}>Phone:</span>
                  <span>{appointment.patientPhone || appointment.patient?.user?.phone || '+1 98765 43210'}</span>

                  <span style={{ color: '#64748b' }}>Address:</span>
                  <span style={{ fontSize: '0.8rem' }}>{appointment.patientAddress || appointment.patient?.address || 'City Center'}</span>
                </div>
              </div>

              {/* Right: Doctor & Department Details */}
              <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: '700', color: '#0f172a', marginBottom: '0.6rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Stethoscope size={15} color="var(--primary-600)" />
                  <span>Consultation Details</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '0.4rem', color: '#334155' }}>
                  <span style={{ color: '#64748b' }}>Doctor:</span>
                  <strong>{appointment.doctorName || appointment.doctor?.user?.name}</strong>

                  <span style={{ color: '#64748b' }}>Dept:</span>
                  <span>{appointment.departmentName || appointment.doctor?.department?.name || 'General'}</span>

                  <span style={{ color: '#64748b' }}>Date:</span>
                  <strong style={{ color: '#0f766e' }}>{appointment.appointmentDate}</strong>

                  <span style={{ color: '#64748b' }}>Time Slot:</span>
                  <strong style={{ color: '#0f766e' }}>{appointment.appointmentTime}</strong>

                  <span style={{ color: '#64748b' }}>Room No:</span>
                  <span>{appointment.doctorRoomNumber || appointment.doctor?.roomNumber || 'Room 104'}</span>
                </div>
              </div>
            </div>

            {/* Visit Reason & Symptoms */}
            {(appointment.reason || appointment.symptoms) && (
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                marginBottom: '1.5rem',
                fontSize: '0.85rem'
              }}>
                <div style={{ fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>
                  Reason / Primary Symptoms:
                </div>
                <div style={{ color: '#475569' }}>
                  {appointment.reason ? `${appointment.reason} — ` : ''}{appointment.symptoms || 'Routine checkup consultation'}
                </div>
              </div>
            )}

            {/* Slip Instructions & Footer */}
            <div style={{
              borderTop: '1px solid #e2e8f0',
              paddingTop: '0.75rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              fontSize: '0.75rem',
              color: '#64748b'
            }}>
              <div>
                <div>• Please report to the OP reception counter 15 minutes before your scheduled slot.</div>
                <div>• Carry this slip (digital or printed) along with any prior medical records.</div>
              </div>
              <div style={{ textAlign: 'center', minWidth: '120px' }}>
                <div style={{ height: '30px' }} />
                <div style={{ borderTop: '1px solid #94a3b8', paddingTop: '2px', fontWeight: '600' }}>
                  Authorized Signatory
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
