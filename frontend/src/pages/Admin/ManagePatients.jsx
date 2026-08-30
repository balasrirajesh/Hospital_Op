import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Users, Search, UserCheck, UserX, Phone, Mail, MapPin } from 'lucide-react';

export const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllPatients();
      setPatients(data);
    } catch (err) {
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleToggleStatus = async (patientId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await adminService.updatePatientStatus(patientId, newStatus);
      setPatients(patients.map((p) => p.id === patientId ? { ...p, status: newStatus } : p));
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const filteredPatients = patients.filter((p) => {
    const term = searchTerm.toLowerCase();
    const name = (p.name || p.user?.name || '').toLowerCase();
    const email = (p.email || p.user?.email || '').toLowerCase();
    const phone = (p.phone || p.user?.phone || '').toLowerCase();
    return name.includes(term) || email.includes(term) || phone.includes(term);
  });

  return (
    <div className="dashboard-main">
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-700)', fontWeight: '700', fontSize: '0.875rem' }}>
          <Users size={16} />
          <span>Patient Registry</span>
        </div>
        <h1 style={{ fontSize: '2rem', marginTop: '0.2rem' }}>Registered Patients Directory</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          View registered patient profiles, medical demographics, and account statuses.
        </p>
      </div>

      <div className="card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', maxWidth: '400px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search patient by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
          />
        </div>
      </div>

      <div className="custom-table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Age / Gender</th>
              <th>Address</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Account Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>
                  Loading patient records...
                </td>
              </tr>
            ) : filteredPatients.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No patients found.
                </td>
              </tr>
            ) : (
              filteredPatients.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>
                      {p.name || p.user?.name}
                    </div>
                  </td>
                  <td>{p.email || p.user?.email}</td>
                  <td>{p.phone || p.user?.phone}</td>
                  <td>{p.age || '30'} Yrs / {p.gender || 'Male'}</td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {p.address || 'Local Residence'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${p.status === 'ACTIVE' || !p.status ? 'badge-success' : 'badge-danger'}`}>
                      {p.status || 'ACTIVE'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => handleToggleStatus(p.id, p.status || 'ACTIVE')}
                      className="btn btn-secondary btn-sm"
                    >
                      {p.status === 'INACTIVE' ? 'Activate' : 'Deactivate'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
