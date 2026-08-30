import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { departmentService } from '../services/departmentService';
import { doctorService } from '../services/doctorService';
import { appointmentService } from '../services/appointmentService';
import confetti from 'canvas-confetti';
import { 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  Building2, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const OpRegistration = () => {
  const { user, isAuthenticated, isPatient } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const preselectedDoctorId = searchParams.get('doctorId') || '';
  const preselectedDeptId = searchParams.get('departmentId') || '';

  // Data lists
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotMessage, setSlotMessage] = useState('');

  // Form State
  const [selectedDepartment, setSelectedDepartment] = useState(preselectedDeptId);
  const [selectedDoctor, setSelectedDoctor] = useState(preselectedDoctorId);
  
  // Default to today or tomorrow formatted YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];
  const [appointmentDate, setAppointmentDate] = useState(todayStr);
  const [selectedSlot, setSelectedSlot] = useState('');

  // Patient Info
  const [patientName, setPatientName] = useState(user?.name || '');
  const [patientAge, setPatientAge] = useState(user?.age || '32');
  const [patientGender, setPatientGender] = useState(user?.gender || 'Male');
  const [patientPhone, setPatientPhone] = useState(user?.phone || '');
  const [patientAddress, setPatientAddress] = useState(user?.address || '');

  // Visit Info
  const [reason, setReason] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [previousMedicalHistory, setPreviousMedicalHistory] = useState('');

  // UI state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch departments on load
  useEffect(() => {
    departmentService.getAllDepartments()
      .then(setDepartments)
      .catch((err) => console.error('Error fetching departments:', err));
  }, []);

  // Fetch doctors when department changes
  useEffect(() => {
    if (selectedDepartment) {
      doctorService.getDoctorsByDepartment(selectedDepartment)
        .then((docs) => {
          setDoctors(docs);
          // If preselected doctor belongs to this dept, keep it, else reset
          if (!docs.some((d) => d.id == selectedDoctor)) {
            if (!preselectedDoctorId) setSelectedDoctor('');
          }
        })
        .catch((err) => console.error('Error fetching dept doctors:', err));
    } else {
      doctorService.getAllDoctors()
        .then((docs) => {
          setDoctors(docs);
          if (preselectedDoctorId && docs.some((d) => d.id == preselectedDoctorId)) {
            setSelectedDoctor(preselectedDoctorId);
            const doc = docs.find((d) => d.id == preselectedDoctorId);
            if (doc && doc.departmentId) setSelectedDepartment(doc.departmentId);
          }
        })
        .catch((err) => console.error('Error loading all doctors:', err));
    }
  }, [selectedDepartment]);

  // If preselected doctor passed in query, set department
  useEffect(() => {
    if (preselectedDoctorId && doctors.length > 0) {
      const doc = doctors.find((d) => d.id == preselectedDoctorId);
      if (doc) {
        setSelectedDoctor(doc.id);
        if (doc.departmentId) setSelectedDepartment(doc.departmentId);
      }
    }
  }, [preselectedDoctorId, doctors]);

  // Load available slots whenever doctor or date changes
  useEffect(() => {
    if (selectedDoctor && appointmentDate) {
      setLoadingSlots(true);
      setSlotMessage('');
      setSelectedSlot('');

      appointmentService.getAvailableSlots(selectedDoctor, appointmentDate)
        .then((data) => {
          // data format: { available: boolean, message: string, slots: [{ time: "10:00 AM", available: true, bookedCount: 1, maxCapacity: 3 }] }
          if (data && data.slots) {
            setAvailableSlots(data.slots);
            if (data.message) setSlotMessage(data.message);
          } else if (Array.isArray(data)) {
            setAvailableSlots(data);
          } else {
            setAvailableSlots([]);
          }
        })
        .catch((err) => {
          console.error('Error fetching slots:', err);
          setAvailableSlots([]);
          setSlotMessage('Could not load slots for the selected date. Doctor may not be scheduled or on leave.');
        })
        .finally(() => setLoadingSlots(false));
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDoctor, appointmentDate]);

  // Validation
  const handleOpenReview = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!patientName.trim()) {
      setErrorMsg('Patient name is required.');
      return;
    }
    if (!patientPhone.trim()) {
      setErrorMsg('Mobile number is required for OP notifications.');
      return;
    }
    if (!selectedDoctor) {
      setErrorMsg('Please select a specialist doctor.');
      return;
    }
    if (!appointmentDate) {
      setErrorMsg('Please select an appointment date.');
      return;
    }
    if (new Date(appointmentDate) < new Date(todayStr)) {
      setErrorMsg('Appointment date cannot be in the past.');
      return;
    }
    if (!selectedSlot) {
      setErrorMsg('Please select an available consultation time slot.');
      return;
    }
    if (!reason.trim()) {
      setErrorMsg('Please provide the reason for visit or primary complaint.');
      return;
    }

    setReviewModalOpen(true);
  };

  // Submit and Generate OP
  const handleConfirmRegistration = async () => {
    setSubmitting(true);
    setErrorMsg('');

    const bookingPayload = {
      doctorId: Number(selectedDoctor),
      departmentId: selectedDepartment ? Number(selectedDepartment) : null,
      appointmentDate: appointmentDate,
      appointmentTime: selectedSlot,
      patientName,
      patientAge: Number(patientAge) || 30,
      patientGender,
      patientPhone,
      patientAddress,
      reason,
      symptoms,
      previousMedicalHistory
    };

    try {
      const result = await appointmentService.bookAppointment(bookingPayload);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore confetti errors
      }

      // Navigate to confirmation page
      navigate(`/op-confirmation?opNumber=${result.opNumber || result.id}`, {
        state: { appointment: result }
      });
    } catch (err) {
      console.error('Registration failed:', err);
      const msg = err.response?.data?.message || 'Failed to complete OP registration. The slot may have just been booked or doctor is on leave.';
      setErrorMsg(msg);
      setReviewModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedDoctorObj = doctors.find((d) => d.id == selectedDoctor);
  const selectedDeptObj = departments.find((d) => d.id == selectedDepartment);

  return (
    <div className="page-container" style={{ maxWidth: '960px' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
          <ShieldCheck size={14} /> Official Hospital OP Desk
        </span>
        <h1 style={{ fontSize: '2.25rem', color: '#0f172a' }}>Out-Patient (OP) Registration</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Fill in the details below to secure your consultation time slot and receive your unique OP Token number.
        </p>
      </div>

      {errorMsg && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#b91c1c',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleOpenReview}>
        {/* Step 1: Doctor & Department Selection */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <Building2 size={20} color="var(--primary-600)" />
            <h2 style={{ fontSize: '1.25rem' }}>1. Select Department & Doctor</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {/* Department */}
            <div className="form-group">
              <label className="form-label">Medical Department</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="form-select"
              >
                <option value="">-- Choose Department (Optional) --</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Doctor */}
            <div className="form-group">
              <label className="form-label">Specialist Doctor *</label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="form-select"
                required
              >
                <option value="">-- Select Doctor --</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} — {doc.specialization} ({doc.departmentName || 'Specialist'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedDoctorObj && (
            <div style={{
              backgroundColor: '#f0fdfa',
              border: '1px solid #ccfbf1',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginTop: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src={selectedDoctorObj.profileImage || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80'}
                  alt="Doctor"
                  style={{ width: '45px', height: '45px', borderRadius: '10px', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{selectedDoctorObj.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary-800)' }}>
                    {selectedDoctorObj.qualification} • {selectedDoctorObj.experience || '10'} Yrs Exp.
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--primary-900)' }}>
                <strong>Working Window:</strong> {selectedDoctorObj.timingSummary || '09:00 AM - 01:00 PM'}
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Date & Real-time Slot Picker */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <Clock size={20} color="var(--primary-600)" />
            <h2 style={{ fontSize: '1.25rem' }}>2. Appointment Date & Consultation Time Slot</h2>
          </div>

          <div style={{ maxWidth: '300px', marginBottom: '1.5rem' }}>
            <label className="form-label">Consultation Date *</label>
            <input
              type="date"
              min={todayStr}
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div>
            <label className="form-label">Available Time Slots for {appointmentDate}</label>
            
            {!selectedDoctor ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Please choose a doctor above to check live slot availability.
              </p>
            ) : loadingSlots ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Checking real-time slot capacity...
              </div>
            ) : availableSlots.length === 0 ? (
              <div style={{ padding: '1.5rem', backgroundColor: '#fffbeb', borderRadius: 'var(--radius-md)', color: '#b45309', fontSize: '0.9rem' }}>
                {slotMessage || 'No available slots found for this doctor on the selected date. Doctor might not be scheduled or is on approved leave.'}
              </div>
            ) : (
              <div>
                <div className="slot-grid">
                  {availableSlots.map((slot, idx) => {
                    const isBooked = !slot.available || (slot.bookedCount >= slot.maxCapacity);
                    const isSelected = selectedSlot === slot.time;

                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          if (!isBooked) setSelectedSlot(slot.time);
                        }}
                        className={`slot-card ${isBooked ? 'fully-booked' : 'available'} ${isSelected ? 'selected' : ''}`}
                      >
                        <div className="slot-time">{slot.time}</div>
                        <div className="slot-status">
                          {isBooked ? (
                            <span style={{ color: '#ef4444' }}>🔴 Fully Booked</span>
                          ) : (
                            <span style={{ color: isSelected ? '#ffffff' : '#10b981' }}>
                              🟢 Available ({slot.maxCapacity - (slot.bookedCount || 0)} left)
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {selectedSlot && (
                  <div style={{ marginTop: '1rem', color: 'var(--primary-700)', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={16} /> Selected Slot: {selectedSlot} on {appointmentDate}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Step 3: Patient Information */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <User size={20} color="var(--primary-600)" />
            <h2 style={{ fontSize: '1.25rem' }}>3. Patient Details</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Suresh Kumar"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Number *</label>
              <input
                type="tel"
                placeholder="e.g. +1 (555) 019-2834"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Age *</label>
              <input
                type="number"
                min="1"
                max="120"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Gender *</label>
              <select
                value={patientGender}
                onChange={(e) => setPatientGender(e.target.value)}
                className="form-select"
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Residential Address</label>
            <input
              type="text"
              placeholder="e.g. 42 Main Street, Apartment 4B"
              value={patientAddress}
              onChange={(e) => setPatientAddress(e.target.value)}
              className="form-control"
            />
          </div>
        </div>

        {/* Step 4: Visit & Clinical Information */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <FileText size={20} color="var(--primary-600)" />
            <h2 style={{ fontSize: '1.25rem' }}>4. Reason for Visit & Symptoms</h2>
          </div>

          <div className="form-group">
            <label className="form-label">Primary Reason for Visit *</label>
            <input
              type="text"
              placeholder="e.g. Chest tightness / High Blood Pressure Follow-up / Persistent Headache"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Symptoms & Complaints (Detailed)</label>
            <textarea
              rows="3"
              placeholder="Describe what you are feeling, duration of symptoms, fever, pain levels, etc."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Previous Medical History / Allergies (Optional)</label>
            <textarea
              rows="2"
              placeholder="Existing conditions (Diabetes, Hypertension), current medications, drug allergies..."
              value={previousMedicalHistory}
              onChange={(e) => setPreviousMedicalHistory(e.target.value)}
              className="form-control"
            />
          </div>
        </div>

        {/* Review & Submit Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ minWidth: '220px' }}
          >
            <span>Review & Confirm Registration</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </form>

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="modal-overlay" onClick={() => setReviewModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="card-header">
              <h3 style={{ fontSize: '1.25rem' }}>Review OP Registration Summary</h3>
              <button 
                onClick={() => setReviewModalOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.25rem' }}
              >
                ✕
              </button>
            </div>

            <div className="card-body">
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Please review your details before confirming your out-patient slot. An official OP Token will be generated upon confirmation.
              </p>

              <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                <div><strong>Patient Name:</strong> {patientName} ({patientAge} Yrs, {patientGender})</div>
                <div><strong>Mobile:</strong> {patientPhone}</div>
                <div><strong>Doctor:</strong> {selectedDoctorObj?.name} ({selectedDoctorObj?.specialization})</div>
                <div><strong>Department:</strong> {selectedDeptObj?.name || selectedDoctorObj?.departmentName || 'General OP'}</div>
                <div><strong>Date & Time Slot:</strong> <span style={{ color: 'var(--primary-700)', fontWeight: '700' }}>{appointmentDate} at {selectedSlot}</span></div>
                <div><strong>Reason:</strong> {reason}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="btn btn-secondary"
                  disabled={submitting}
                >
                  Edit Details
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRegistration}
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Generating OP Token...' : 'Confirm OP Registration'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
