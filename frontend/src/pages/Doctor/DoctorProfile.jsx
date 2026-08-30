import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doctorService } from '../../services/doctorService';
import { Stethoscope, User, Award, Building, CheckCircle2, Save } from 'lucide-react';

export const DoctorProfile = () => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const [doctorData, setDoctorData] = useState({
    name: user?.name || 'Dr. Ravi Kumar',
    doctorId: 'DOC-101',
    qualification: 'MBBS, MD (Cardiology)',
    specialization: 'Cardiologist',
    experience: 12,
    roomNumber: 'Room 102 (Cardio OP Wing)',
    bio: 'Senior Consultant Cardiologist specializing in preventive cardiology, coronary interventions, and adult heart disease rehabilitation.',
    profileImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',
    phone: '+1 (555) 345-6789'
  });

  useEffect(() => {
    if (user?.doctorId) {
      doctorService.getDoctorById(user.doctorId)
        .then((doc) => {
          if (doc) {
            setDoctorData({
              name: doc.name || user.name,
              doctorId: doc.doctorId || 'DOC-101',
              qualification: doc.qualification || 'MBBS, MD',
              specialization: doc.specialization || 'Consultant',
              experience: doc.experience || 10,
              roomNumber: doc.roomNumber || 'Room 101',
              bio: doc.bio || '',
              profileImage: doc.profileImage || '',
              phone: doc.phone || ''
            });
          }
        })
        .catch((err) => console.error('Error fetching doc profile:', err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user?.doctorId) {
      try {
        await doctorService.updateDoctor(user.doctorId, doctorData);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } catch (err) {
        console.error('Update doc profile error:', err);
        alert('Failed to update doctor profile.');
      }
    }
  };

  return (
    <div className="dashboard-main" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-700)', fontWeight: '700', fontSize: '0.875rem' }}>
          <Stethoscope size={16} />
          <span>Practitioner Account</span>
        </div>
        <h1 style={{ fontSize: '2rem', marginTop: '0.2rem' }}>Doctor Profile Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Update your public medical profile, credentials, and OP room assignment.
        </p>
      </div>

      {saved && (
        <div style={{
          backgroundColor: '#ecfdf5',
          border: '1px solid #a7f3d0',
          color: '#047857',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.9rem'
        }}>
          <CheckCircle2 size={18} />
          <span>Doctor credentials and profile updated successfully!</span>
        </div>
      )}

      <div className="card" style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '2rem' }}>
            <img
              src={doctorData.profileImage || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80'}
              alt="Profile"
              style={{ width: '90px', height: '90px', borderRadius: '18px', objectFit: 'cover', border: '3px solid var(--primary-100)' }}
            />
            <div style={{ flex: 1 }}>
              <label className="form-label">Profile Image URL</label>
              <input
                type="url"
                value={doctorData.profileImage}
                onChange={(e) => setDoctorData({ ...doctorData, profileImage: e.target.value })}
                className="form-control"
                placeholder="https://..."
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                value={doctorData.name}
                onChange={(e) => setDoctorData({ ...doctorData, name: e.target.value })}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Doctor ID</label>
              <input
                type="text"
                value={doctorData.doctorId}
                className="form-control"
                disabled
                style={{ backgroundColor: '#f1f5f9' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Qualifications (Degrees)</label>
              <input
                type="text"
                value={doctorData.qualification}
                onChange={(e) => setDoctorData({ ...doctorData, qualification: e.target.value })}
                className="form-control"
                placeholder="e.g. MBBS, MD, FRCS"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Specialization</label>
              <input
                type="text"
                value={doctorData.specialization}
                onChange={(e) => setDoctorData({ ...doctorData, specialization: e.target.value })}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Years of Experience</label>
              <input
                type="number"
                value={doctorData.experience}
                onChange={(e) => setDoctorData({ ...doctorData, experience: Number(e.target.value) })}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">OP Room Number</label>
              <input
                type="text"
                value={doctorData.roomNumber}
                onChange={(e) => setDoctorData({ ...doctorData, roomNumber: e.target.value })}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Professional Biography & Clinical Experience</label>
            <textarea
              rows="3"
              value={doctorData.bio}
              onChange={(e) => setDoctorData({ ...doctorData, bio: e.target.value })}
              className="form-control"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              <span>Save Doctor Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
