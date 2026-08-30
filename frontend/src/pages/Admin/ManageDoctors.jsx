import React, { useState, useEffect } from 'react';
import { doctorService } from '../../services/doctorService';
import { departmentService } from '../../services/departmentService';
import { Stethoscope, Plus, Edit, CheckCircle2, XCircle, Search, Mail, Phone, Award } from 'lucide-react';

export const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formDoctorId, setFormDoctorId] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formPassword, setFormPassword] = useState('doctor123');
  const [formQualification, setFormQualification] = useState('');
  const [formSpecialization, setFormSpecialization] = useState('');
  const [formExperience, setFormExperience] = useState(8);
  const [formDepartmentId, setFormDepartmentId] = useState('');
  const [formProfileImage, setFormProfileImage] = useState('');
  const [formRoomNumber, setFormRoomNumber] = useState('Room 101');
  const [formBio, setFormBio] = useState('');
  const [formStatus, setFormStatus] = useState('ACTIVE');
  const [saving, setSaving] = useState(false);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [docs, depts] = await Promise.all([
        doctorService.getAllDoctors(),
        departmentService.getAllDepartments()
      ]);
      setDoctors(docs);
      setDepartments(depts);
    } catch (err) {
      console.error('Error fetching doctors data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleOpenAdd = () => {
    setEditingDoctor(null);
    setFormName('');
    setFormDoctorId(`DOC-${Math.floor(100 + Math.random() * 900)}`);
    setFormEmail('');
    setFormPhone('');
    setFormPassword('doctor123');
    setFormQualification('MBBS, MD');
    setFormSpecialization('');
    setFormExperience(5);
    setFormDepartmentId(departments[0]?.id || '');
    setFormProfileImage('https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80');
    setFormRoomNumber('Room 101');
    setFormBio('');
    setFormStatus('ACTIVE');
    setModalOpen(true);
  };

  const handleOpenEdit = (doc) => {
    setEditingDoctor(doc);
    setFormName(doc.name);
    setFormDoctorId(doc.doctorId || 'DOC-101');
    setFormEmail(doc.email || doc.user?.email || '');
    setFormPhone(doc.phone || doc.user?.phone || '');
    setFormPassword('');
    setFormQualification(doc.qualification || '');
    setFormSpecialization(doc.specialization || '');
    setFormExperience(doc.experience || 5);
    setFormDepartmentId(doc.departmentId || doc.department?.id || '');
    setFormProfileImage(doc.profileImage || '');
    setFormRoomNumber(doc.roomNumber || 'Room 101');
    setFormBio(doc.bio || '');
    setFormStatus(doc.status || 'ACTIVE');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: formName.trim(),
        doctorId: formDoctorId.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim(),
        password: formPassword,
        qualification: formQualification.trim(),
        specialization: formSpecialization.trim(),
        experience: Number(formExperience) || 5,
        departmentId: Number(formDepartmentId),
        profileImage: formProfileImage.trim(),
        roomNumber: formRoomNumber.trim(),
        bio: formBio.trim(),
        status: formStatus
      };

      if (editingDoctor) {
        await doctorService.updateDoctor(editingDoctor.id, payload);
      } else {
        await doctorService.createDoctor(payload);
      }
      setModalOpen(false);
      fetchInitialData();
    } catch (err) {
      console.error('Save doctor error:', err);
      alert('Failed to save doctor.');
    } finally {
      setSaving(false);
    }
  };

  const filteredDocs = doctors.filter((doc) => {
    if (selectedDept && doc.departmentId != selectedDept && doc.department?.id != selectedDept) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const n = (doc.name || '').toLowerCase();
      const s = (doc.specialization || '').toLowerCase();
      const d = (doc.doctorId || '').toLowerCase();
      return n.includes(term) || s.includes(term) || d.includes(term);
    }
    return true;
  });

  return (
    <div className="dashboard-main">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-700)', fontWeight: '700', fontSize: '0.875rem' }}>
            <Stethoscope size={16} />
            <span>Hospital Administration</span>
          </div>
          <h1 style={{ fontSize: '2rem', marginTop: '0.2rem' }}>Doctor Directory & Rosters</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Add new clinical consultants, assign medical departments, and manage practitioner statuses.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={16} />
          <span>Add New Doctor</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search doctor or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.25rem', fontSize: '0.875rem' }}
            />
          </div>

          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="form-select"
              style={{ fontSize: '0.875rem' }}
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Doctors Table */}
      <div className="custom-table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Doctor ID</th>
              <th>Department</th>
              <th>Qualification / Exp</th>
              <th>Room No</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>
                  Loading doctor directory...
                </td>
              </tr>
            ) : filteredDocs.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No doctors found matching filters.
                </td>
              </tr>
            ) : (
              filteredDocs.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={doc.profileImage || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80'}
                        alt={doc.name}
                        style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: '700', color: '#0f172a' }}>{doc.name}</div>
                        <div style={{ fontSize: '0.775rem', color: 'var(--primary-700)', fontWeight: '600' }}>{doc.specialization}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-primary">{doc.doctorId || `DOC-${doc.id}`}</span>
                  </td>
                  <td>
                    <span className="badge badge-info">{doc.departmentName || doc.department?.name || 'General'}</span>
                  </td>
                  <td>
                    <div>{doc.qualification}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{doc.experience || '8'} Yrs Experience</div>
                  </td>
                  <td>{doc.roomNumber || 'Room 101'}</td>
                  <td>
                    <span className={`badge ${doc.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
                      {doc.status || 'ACTIVE'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => handleOpenEdit(doc)}
                      className="btn btn-secondary btn-sm"
                    >
                      <Edit size={14} />
                      <span>Edit</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="card-header">
              <h3 style={{ fontSize: '1.25rem' }}>
                {editingDoctor ? 'Edit Doctor Profile' : 'Register New Doctor'}
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.25rem' }}
              >
                ✕
              </button>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Doctor Name *</label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="form-control"
                      placeholder="e.g. Dr. Anand Verma"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Doctor ID *</label>
                    <input
                      type="text"
                      value={formDoctorId}
                      onChange={(e) => setFormDoctorId(e.target.value)}
                      className="form-control"
                      placeholder="e.g. DOC-104"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Email (Login) *</label>
                    <input
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="form-control"
                      placeholder="doctor@hospital.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className="form-control"
                      placeholder="+1 (555) 019-2834"
                      required
                    />
                  </div>
                </div>

                {!editingDoctor && (
                  <div className="form-group">
                    <label className="form-label">Initial Password *</label>
                    <input
                      type="password"
                      value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Department *</label>
                    <select
                      value={formDepartmentId}
                      onChange={(e) => setFormDepartmentId(e.target.value)}
                      className="form-select"
                      required
                    >
                      <option value="">-- Choose Department --</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Specialization *</label>
                    <input
                      type="text"
                      value={formSpecialization}
                      onChange={(e) => setFormSpecialization(e.target.value)}
                      className="form-control"
                      placeholder="e.g. Neurologist, Orthopedic Surgeon"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Qualification *</label>
                    <input
                      type="text"
                      value={formQualification}
                      onChange={(e) => setFormQualification(e.target.value)}
                      className="form-control"
                      placeholder="MBBS, MD"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Experience (Yrs)</label>
                    <input
                      type="number"
                      value={formExperience}
                      onChange={(e) => setFormExperience(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Room No</label>
                    <input
                      type="text"
                      value={formRoomNumber}
                      onChange={(e) => setFormRoomNumber(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Profile Image URL</label>
                  <input
                    type="url"
                    value={formProfileImage}
                    onChange={(e) => setFormProfileImage(e.target.value)}
                    className="form-control"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Doctor Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="form-select"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : editingDoctor ? 'Update Doctor' : 'Register Doctor'}
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
