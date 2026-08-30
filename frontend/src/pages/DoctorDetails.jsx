import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doctorService } from '../services/doctorService';
import { 
  Award, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  CalendarCheck,
  Stethoscope,
  Building,
  Mail,
  Phone
} from 'lucide-react';

export const DoctorDetails = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const [docData, schedData] = await Promise.all([
          doctorService.getDoctorById(id),
          doctorService.getDoctorSchedules(id).catch(() => [])
        ]);
        setDoctor(docData);
        setSchedules(schedData);
      } catch (err) {
        console.error('Error loading doctor details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid var(--primary-100)',
          borderTopColor: 'var(--primary-600)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 1rem'
        }} />
        <p style={{ color: 'var(--text-muted)' }}>Loading doctor profile...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <h2>Doctor Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          The requested doctor profile could not be found.
        </p>
        <Link to="/doctors" className="btn btn-primary">Back to Doctors</Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Back Link */}
      <Link 
        to="/doctors" 
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={16} />
        <span>Back to Doctors Directory</span>
      </Link>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Left Column: Doctor Profile Card */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <img
              src={doctor.profileImage || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80'}
              alt={doctor.name}
              style={{
                width: '110px',
                height: '110px',
                borderRadius: '20px',
                objectFit: 'cover',
                border: '3px solid var(--primary-100)'
              }}
            />
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span className="badge badge-primary">{doctor.doctorId || 'DOC-101'}</span>
                <span className="badge badge-success"><CheckCircle2 size={12} /> Active Practitioner</span>
              </div>
              <h1 style={{ fontSize: '1.65rem', color: '#0f172a', marginBottom: '0.2rem' }}>
                {doctor.name}
              </h1>
              <div style={{ color: 'var(--primary-700)', fontWeight: '700', fontSize: '1rem' }}>
                {doctor.specialization}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {doctor.qualification}
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem',
            padding: '1.25rem',
            backgroundColor: '#f8fafc',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                Experience
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginTop: '0.2rem' }}>
                {doctor.experience || '12'} Years
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                Department
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginTop: '0.2rem' }}>
                {doctor.departmentName || doctor.department?.name || 'Cardiology'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                OP Room No.
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginTop: '0.2rem' }}>
                {doctor.roomNumber || 'Room 102 (OP Wing)'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                Consultation Fee
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--primary-700)', marginTop: '0.2rem' }}>
                $40 / ₹500
              </div>
            </div>
          </div>

          {/* Doctor Bio */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>About Doctor</h3>
            <p style={{ color: '#475569', fontSize: '0.925rem', lineHeight: '1.6' }}>
              {doctor.bio || `${doctor.name} is a renowned specialist in ${doctor.specialization} with over ${doctor.experience || 10} years of clinical expertise treating out-patients, performing complex diagnostics, and leading patient rehabilitation.`}
            </p>
          </div>

          {/* Direct CTA */}
          <Link
            to={`/op-registration?doctorId=${doctor.id}`}
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
          >
            <CalendarCheck size={20} />
            <span>Proceed to OP Registration</span>
          </Link>
        </div>

        {/* Right Column: Weekly Consultation Availability Schedule */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <Clock size={20} color="var(--primary-600)" />
            <h2 style={{ fontSize: '1.35rem' }}>Weekly Consultation Timings</h2>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Below are the confirmed working days and consultation windows for {doctor.name}.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map((day) => {
              const sched = schedules.find((s) => s.dayOfWeek === day && s.active !== false);

              return (
                <div
                  key={day}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.9rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: sched ? '#ffffff' : '#f8fafc',
                    border: sched ? '1px solid var(--primary-200)' : '1px solid var(--border-color)',
                    boxShadow: sched ? 'var(--shadow-sm)' : 'none'
                  }}
                >
                  <div style={{ fontWeight: '700', fontSize: '0.925rem', color: sched ? '#0f172a' : '#94a3b8' }}>
                    {day.charAt(0) + day.slice(1).toLowerCase()}
                  </div>

                  {sched ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--primary-800)' }}>
                        {sched.startTime} - {sched.endTime}
                      </span>
                      <span className="badge badge-success">Available</span>
                    </div>
                  ) : (
                    <div>
                      <span className="badge badge-secondary" style={{ backgroundColor: '#f1f5f9', color: '#94a3b8' }}>
                        Not Available
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-50)',
            border: '1px solid var(--primary-200)',
            fontSize: '0.85rem',
            color: 'var(--primary-900)'
          }}>
            <strong>Notice:</strong> Emergency consultations and walk-in tokens may be available at the main OP counter subject to on-duty triage.
          </div>
        </div>
      </div>
    </div>
  );
};
