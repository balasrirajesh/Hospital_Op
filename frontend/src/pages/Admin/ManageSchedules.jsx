import React, { useState, useEffect } from 'react';
import { doctorService } from '../../services/doctorService';
import { Clock, Calendar, Stethoscope, Search } from 'lucide-react';

export const ManageSchedules = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDoctorData, setLoadingDoctorData] = useState(false);

  useEffect(() => {
    doctorService.getAllDoctors()
      .then((docs) => {
        setDoctors(docs);
        if (docs.length > 0) {
          setSelectedDoctorId(docs[0].id);
        }
      })
      .catch((err) => console.error('Error fetching doctors:', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedDoctorId) {
      setLoadingDoctorData(true);
      Promise.all([
        doctorService.getDoctorSchedules(selectedDoctorId).catch(() => []),
        doctorService.getDoctorLeaves(selectedDoctorId).catch(() => [])
      ])
        .then(([schedData, leaveData]) => {
          setSchedules(schedData);
          setLeaves(leaveData);
        })
        .finally(() => setLoadingDoctorData(false));
    }
  }, [selectedDoctorId]);

  const selectedDoctorObj = doctors.find((d) => d.id == selectedDoctorId);

  return (
    <div className="dashboard-main">
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-700)', fontWeight: '700', fontSize: '0.875rem' }}>
          <Clock size={16} />
          <span>Hospital Administration</span>
        </div>
        <h1 style={{ fontSize: '2rem', marginTop: '0.2rem' }}>Doctor Schedule & Leave Oversight</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Audit weekly clinic timings, slot capacities, and registered leave dates across all hospital doctors.
        </p>
      </div>

      {/* Select Doctor Bar */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', maxWidth: '500px' }}>
        <label className="form-label">Select Doctor to View Schedule</label>
        <select
          value={selectedDoctorId}
          onChange={(e) => setSelectedDoctorId(e.target.value)}
          className="form-select"
        >
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} — {d.specialization} ({d.departmentName || 'Specialist'})
            </option>
          ))}
        </select>
      </div>

      {selectedDoctorObj && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Weekly Timings */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} color="var(--primary-600)" />
              <span>Weekly Consultation Roster</span>
            </h3>

            {loadingDoctorData ? (
              <p style={{ color: 'var(--text-muted)' }}>Loading timings...</p>
            ) : schedules.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No active consultation schedules set for this doctor.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {schedules.map((s) => (
                  <div
                    key={s.id || s.dayOfWeek}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: s.active !== false ? '#ffffff' : '#f8fafc',
                      border: s.active !== false ? '1px solid var(--primary-200)' : '1px solid var(--border-color)'
                    }}
                  >
                    <div>
                      <strong style={{ color: '#0f172a' }}>{s.dayOfWeek}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Slot: {s.slotDurationMinutes || 30} mins • Max: {s.maxPatientsPerSlot || 3} patients/slot
                      </div>
                    </div>

                    <div>
                      {s.active !== false ? (
                        <span className="badge badge-success">{s.startTime} - {s.endTime}</span>
                      ) : (
                        <span className="badge badge-secondary">Off</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Leaves List */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} color="var(--primary-600)" />
              <span>Approved Leave Dates</span>
            </h3>

            {loadingDoctorData ? (
              <p style={{ color: 'var(--text-muted)' }}>Loading leaves...</p>
            ) : leaves.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No scheduled leave dates for {selectedDoctorObj.name}.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {leaves.map((l) => (
                  <div
                    key={l.id}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#fff1f2',
                      border: '1px solid #fecdd3',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <strong style={{ color: '#be123c' }}>📅 {l.leaveDate}</strong>
                      <div style={{ fontSize: '0.8rem', color: '#475569' }}>{l.reason || 'General Leave'}</div>
                    </div>
                    <span className="badge badge-danger">Unavailable</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
