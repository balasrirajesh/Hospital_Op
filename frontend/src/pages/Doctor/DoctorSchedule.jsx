import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doctorService } from '../../services/doctorService';
import { 
  Clock, 
  Calendar, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  CalendarOff,
  Save
} from 'lucide-react';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

export const DoctorSchedule = () => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Leave Form
  const [leaveDate, setLeaveDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [addingLeave, setAddingLeave] = useState(false);

  const fetchScheduleData = async () => {
    if (!user?.doctorId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [schedData, leaveData] = await Promise.all([
        doctorService.getDoctorSchedules(user.doctorId).catch(() => []),
        doctorService.getDoctorLeaves(user.doctorId).catch(() => [])
      ]);

      // Ensure all 7 days exist in local state
      const initialized = DAYS.map((day) => {
        const existing = schedData.find((s) => s.dayOfWeek === day);
        return existing || {
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '13:00',
          slotDurationMinutes: 30,
          maxPatientsPerSlot: 3,
          active: day !== 'SUNDAY'
        };
      });

      setSchedules(initialized);
      setLeaves(leaveData);
    } catch (err) {
      console.error('Error fetching schedules:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduleData();
  }, [user]);

  const handleScheduleChange = (index, field, value) => {
    const updated = [...schedules];
    updated[index][field] = value;
    setSchedules(updated);
  };

  const handleSaveSchedules = async () => {
    if (!user?.doctorId) return;
    try {
      await doctorService.updateDoctorSchedules(user.doctorId, schedules);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to update consultation schedules.');
    }
  };

  const handleAddLeave = async (e) => {
    e.preventDefault();
    if (!leaveDate || !user?.doctorId) return;
    setAddingLeave(true);
    try {
      await doctorService.addDoctorLeave(user.doctorId, {
        leaveDate,
        reason: leaveReason
      });
      setLeaveDate('');
      setLeaveReason('');
      fetchScheduleData();
    } catch (err) {
      console.error('Add leave error:', err);
      alert('Failed to register leave date.');
    } finally {
      setAddingLeave(false);
    }
  };

  const handleDeleteLeave = async (leaveId) => {
    if (!user?.doctorId) return;
    try {
      await doctorService.deleteDoctorLeave(user.doctorId, leaveId);
      setLeaves(leaves.filter((l) => l.id !== leaveId));
    } catch (err) {
      console.error('Delete leave error:', err);
    }
  };

  return (
    <div className="dashboard-main" style={{ maxWidth: '1050px' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-700)', fontWeight: '700', fontSize: '0.875rem' }}>
          <Clock size={16} />
          <span>Availability Configuration</span>
        </div>
        <h1 style={{ fontSize: '2rem', marginTop: '0.2rem' }}>Working Hours & Slot Management</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Define your active clinic consultation windows, slot durations, patient caps, and unavailable leave dates.
        </p>
      </div>

      {saveSuccess && (
        <div style={{
          backgroundColor: '#ecfdf5',
          border: '1px solid #a7f3d0',
          color: '#047857',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.9rem'
        }}>
          <CheckCircle2 size={18} />
          <span>Doctor consultation schedules updated successfully!</span>
        </div>
      )}

      {/* Weekly Schedule Builder */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem' }}>Weekly Consultation Timing Grid</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Toggle working days on/off and set consulting shifts.
            </p>
          </div>

          <button
            onClick={handleSaveSchedules}
            className="btn btn-primary"
          >
            <Save size={16} />
            <span>Save All Schedules</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {schedules.map((sched, idx) => (
            <div
              key={sched.dayOfWeek}
              style={{
                display: 'grid',
                gridTemplateColumns: '150px 100px 1fr 1fr 140px 140px',
                gap: '1rem',
                alignItems: 'center',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: sched.active ? '#ffffff' : '#f8fafc',
                border: sched.active ? '1px solid var(--primary-200)' : '1px solid var(--border-color)'
              }}
            >
              {/* Day */}
              <div style={{ fontWeight: '700', fontSize: '0.95rem', color: sched.active ? '#0f172a' : '#94a3b8' }}>
                {sched.dayOfWeek.charAt(0) + sched.dayOfWeek.slice(1).toLowerCase()}
              </div>

              {/* Active Toggle */}
              <div>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>
                  <input
                    type="checkbox"
                    checked={sched.active}
                    onChange={(e) => handleScheduleChange(idx, 'active', e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--primary-600)' }}
                  />
                  <span>{sched.active ? 'Active' : 'Off'}</span>
                </label>
              </div>

              {/* Start Time */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Start Time</label>
                <input
                  type="time"
                  value={sched.startTime || '09:00'}
                  disabled={!sched.active}
                  onChange={(e) => handleScheduleChange(idx, 'startTime', e.target.value)}
                  className="form-control"
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                />
              </div>

              {/* End Time */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>End Time</label>
                <input
                  type="time"
                  value={sched.endTime || '13:00'}
                  disabled={!sched.active}
                  onChange={(e) => handleScheduleChange(idx, 'endTime', e.target.value)}
                  className="form-control"
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                />
              </div>

              {/* Slot Duration */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Slot Duration</label>
                <select
                  value={sched.slotDurationMinutes || 30}
                  disabled={!sched.active}
                  onChange={(e) => handleScheduleChange(idx, 'slotDurationMinutes', Number(e.target.value))}
                  className="form-select"
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                >
                  <option value={15}>15 mins</option>
                  <option value={20}>20 mins</option>
                  <option value={30}>30 mins</option>
                  <option value={45}>45 mins</option>
                  <option value={60}>60 mins</option>
                </select>
              </div>

              {/* Max Patients */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Max Patients/Slot</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={sched.maxPatientsPerSlot || 3}
                  disabled={!sched.active}
                  onChange={(e) => handleScheduleChange(idx, 'maxPatientsPerSlot', Number(e.target.value))}
                  className="form-control"
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Doctor Leave Management */}
      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <CalendarOff size={20} color="var(--primary-600)" />
          <h2 style={{ fontSize: '1.25rem' }}>Unavailable Dates & Leave Registry</h2>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Dates marked as leave will automatically show as unavailable to patients in the OP slot booking engine.
        </p>

        {/* Add Leave Form */}
        <form onSubmit={handleAddLeave} style={{ display: 'grid', gridTemplateColumns: '200px 1fr 140px', gap: '1rem', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <label className="form-label">Leave Date *</label>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={leaveDate}
              onChange={(e) => setLeaveDate(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div>
            <label className="form-label">Reason for Leave</label>
            <input
              type="text"
              placeholder="e.g. Medical conference, personal leave..."
              value={leaveReason}
              onChange={(e) => setLeaveReason(e.target.value)}
              className="form-control"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={addingLeave}
            style={{ height: '42px' }}
          >
            <Plus size={16} />
            <span>Mark Leave</span>
          </button>
        </form>

        {/* Existing Leaves List */}
        <div>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Scheduled Leaves</h3>
          {leaves.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No upcoming leaves registered.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {leaves.map((l) => (
                <div
                  key={l.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#fff1f2',
                    border: '1px solid #fecdd3',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <strong style={{ color: '#be123c' }}>📅 {l.leaveDate}</strong>
                    <span style={{ fontSize: '0.85rem', color: '#475569' }}>{l.reason || 'General leave'}</span>
                  </div>

                  <button
                    onClick={() => handleDeleteLeave(l.id)}
                    style={{ background: 'transparent', border: 'none', color: '#be123c', cursor: 'pointer' }}
                    title="Remove leave"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
