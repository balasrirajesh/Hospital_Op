import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Stethoscope,
  Building
} from 'lucide-react';

export const DoctorCard = ({ doctor }) => {
  const isAvailable = doctor.status === 'ACTIVE' && doctor.isAvailableToday !== false;

  // Format schedule text
  const scheduleDays = doctor.availableDaysSummary || 'Monday - Saturday';
  const scheduleTime = doctor.timingSummary || '09:00 AM - 01:00 PM';

  return (
    <div className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Header with Avatar and Status */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img
              src={doctor.profileImage || `https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80`}
              alt={doctor.name}
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '16px',
                objectFit: 'cover',
                border: '2px solid var(--primary-100)',
                backgroundColor: '#f1f5f9'
              }}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80';
              }}
            />
            <span
              style={{
                position: 'absolute',
                bottom: '-3px',
                right: '-3px',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                backgroundColor: isAvailable ? '#10b981' : '#ef4444',
                border: '2px solid #ffffff'
              }}
              title={isAvailable ? 'Available' : 'Unavailable'}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {doctor.name}
              </h3>
            </div>
            
            <div style={{ color: 'var(--primary-700)', fontWeight: '600', fontSize: '0.875rem', marginTop: '0.1rem' }}>
              {doctor.specialization}
            </div>

            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
              {doctor.qualification}
            </div>
          </div>
        </div>

        {/* Experience & Department */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '1rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <span className="badge badge-primary">
            <Award size={12} /> {doctor.experience || '10+'} Years Exp.
          </span>
          <span className="badge badge-info">
            <Building size={12} /> {doctor.departmentName || doctor.department?.name || 'General OP'}
          </span>
          {isAvailable ? (
            <span className="badge badge-success">
              <CheckCircle2 size={12} /> Available
            </span>
          ) : (
            <span className="badge badge-danger">
              <XCircle size={12} /> Unavailable
            </span>
          )}
        </div>

        {/* Timings and Schedule block */}
        <div style={{
          backgroundColor: '#f8fafc',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem',
          marginBottom: '1.25rem',
          fontSize: '0.825rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155' }}>
            <Calendar size={15} color="var(--primary-600)" style={{ flexShrink: 0 }} />
            <span><strong>Available Days:</strong> {scheduleDays}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155' }}>
            <Clock size={15} color="var(--primary-600)" style={{ flexShrink: 0 }} />
            <span><strong>Time:</strong> {scheduleTime}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: 'auto', display: 'flex', gap: '0.6rem' }}>
          <Link
            to={`/doctors/${doctor.id}`}
            className="btn btn-secondary btn-sm"
            style={{ flex: 1 }}
          >
            View Details
          </Link>
          <Link
            to={`/op-registration?doctorId=${doctor.id}`}
            className="btn btn-primary btn-sm"
            style={{ flex: 1.2 }}
          >
            <span>Register for OP</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
